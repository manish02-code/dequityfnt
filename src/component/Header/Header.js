import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import "./Header.css";
import { Link } from 'react-router-dom';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromSource,web3FromAddress } from '@polkadot/extension-dapp';
import { useNavigate } from "react-router-dom"


import { cryptoWaitReady, mnemonicGenerate, mnemonicToMiniSecret, encodeAddress } from '@polkadot/util-crypto';
import  Keyring from '@polkadot/keyring';



import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBRadio,
} from 'mdb-react-ui-kit';

function Header() {
    const [api, setapi] = useState()
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState();
    const [ParticipantProfileInfo, setParticipantProfileInfo] = useState();
    const [bgcolor, setbgcolor] = useState('#eee')

    const [basicModal, setBasicModal] = useState(false);
    const toggleOpen = () => setBasicModal(!basicModal);



    const [basicModal2, setBasicModal2] = useState(false);
    const toggleOpen2 = () => setBasicModal2(!basicModal2);


    const [selectedValue, setSelectedValue] = useState(null);
    const [account, setAccount] = useState(null);



    const createAccount = async () => {
        try {
     
            await cryptoWaitReady();
       

            const extensions = await web3Enable('Manish');
            if (extensions.length === 0) {
                console.error('No extension installed or authorized');
                return;
            }
   
            const mnemonic = mnemonicGenerate();
            console.log('Mnemonic:', mnemonic);

            console.log('Initializing keyring...');
            const keyring = new Keyring({ type: 'sr25519' });

            console.log('Adding account to keyring...');
            const pair = keyring.addFromUri(mnemonic);

            console.log('Creating account JSON...');
            const json = pair.toJson('123456'); // Replace 'your-password' with your desired password


         

    
            const accounts = await web3Accounts();
            if (accounts.length === 0) {
                console.error('No accounts available');
                return;
            }
            console.log('Accounts fetched from extension:', accounts);

           
            const injector = await web3FromSource(accounts[0].meta.source);


            // console.log('Signing account JSON with extension...');
            // const result = await injector.signer.signRaw({
            //     address: accounts[0].address,
            //     data: JSON.stringify(json),
            //     type: 'bytes'
            // });

            // if (result) {
            //     console.log('Account created and saved to wallet:', pair.address);
            //     setAccount(pair.address);
            // }
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };
    createAccount()


    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        console.log("Selected Value:", event.target.value);


        if(event.target.value === "Buyer"){
            navigate('/DataCollector/CreateProfileBuyer')
            toggleOpen2()
       
    

        }else{
        navigate("/Perticipent/CreateProfile")
        toggleOpen2()
    
        }
    };

    const navigate = useNavigate();

    const handleConnection = async () => {
        try {
            const extensions = await web3Enable("Manish");
            if (!extensions) {
                throw Error("Wallet is not installed");
            }

            const allAccounts = await web3Accounts();


            setAccounts(allAccounts);

            if (allAccounts.length === 1) {

                setSelectedAccount(allAccounts[0]);
                conn(allAccounts[0].address)


                localStorage.setItem('Selected Account', allAccounts[0].address);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const conn = async (account) => {
        const wsProvider = new WsProvider('ws://3.109.51.55:9944'); // Replace with your endpoint
        const api = await ApiPromise.create({ provider: wsProvider });
        setapi(api)

        const data = await api.query.hrmp.participantProfile(account);

        const data2 = await api.query.hrmp.offerCreatorProfile(account);


        if (data.toPrimitive() == null && data2.toPrimitive()  == null) {

            toggleOpen()
            // setSelectedAccount()


        } else {
           
            if(data.toPrimitive() != null){
                setParticipantProfileInfo(data.toPrimitive())
                console.log(data.toPrimitive())
                localStorage.setItem('Selected Account Profile', ParticipantProfileInfo);
                navigate("/Perticipent")


            }else{
                setParticipantProfileInfo(data2.toPrimitive())
                console.log(data2.toPrimitive())

                // location.href = "localhost:3000/DataBuyer";
                localStorage.setItem('Selected Account Profile', ParticipantProfileInfo);
                navigate("/DataBuyer")


            }
            // console.log("Participant Profile:", data.toPrimitive()); // Display or use the data
        }
    }

    const changeAccount = (e) => {
        setSelectedAccount(accounts[e.target.selectedIndex - 1]);
        console.log("change Accunt", accounts[e.target.selectedIndex - 1].address)
        conn(accounts[e.target.selectedIndex - 1].address)
        localStorage.setItem('Selected Account', accounts[e.target.selectedIndex - 1].address);
    };

    const profileinfo = async () => {
        const wsProvider = new WsProvider('ws://3.109.51.55:9944'); // Replace with your endpoint
        const api = await ApiPromise.create({ provider: wsProvider });

        if (!selectedAccount) {
            console.error("No account selected. Please select an account.");
            return;
        }

        try {
            const data = await api.query.hrmp.participantProfile(selectedAccount.address);
            console.log("Participant Profile:", data); // Display or use the data
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            api.disconnect(); // Disconnect from the Polkadot node after fetching data
        }
    };



  

    const CreateProfile = () => {

        toggleOpen()
        // navigate("/Perticipent/CreateProfile")

        toggleOpen2()



        // const wsProvider = new WsProvider('ws://3.109.51.55:9944'); // Replace with your endpoint
        // const api = await ApiPromise.create({ provider: wsProvider });

        // const injector = await web3FromAddress(selectedAccount.address);

        // const result = await api.tx.hrmp.createParticipantProfile("Pratibha Mishra", 44, "Female","Indian" ).signAndSend(selectedAccount.address, { signer: injector.signer });

        // if (!result || !result.hash) {
        //   const errorMessage = result?.error?.message || "Transaction failed";
        //   console.error(errorMessage);
        //   throw new Error(errorMessage);
        // } else {
        //   console.log("Profile created. Transaction hash:", result.toPrimitive());
        //   // Handle success here
        // }

    }

    const Cancelbutton = () => {
        toggleOpen()
        setSelectedAccount()
    }
    return (
        <div style={{ paddingTop: '10px' }}>
            <Navbar bg="light" variant="light" className="custom-shadow custom-border" style={{ maxWidth: '1200px', margin: 'auto', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                <Container>
                    <div className="d-flex align-items-center justify-content-between w-100">
                        <div>
                            <Link to="/" >
                                <Navbar.Brand>Dequity</Navbar.Brand>


                            </Link>
                        </div>
                        <div className="mx-auto">
                            <Nav>
                                <Link to="/DataCollector" className="nav-link-custom nav-link-rounded">Data Collector</Link>
                                <Link to="/Perticipent" className="nav-link-custom nav-link-rounded">Participant</Link>
                                <Link to="/DataBuyer" className="nav-link-custom nav-link-rounded">Data Buyer</Link>
                            </Nav>
                        </div>
                        <div>
                            <Dropdown >
                                {accounts.length === 0 ? (
                                    <Dropdown.Toggle onClick={handleConnection} variant="secondary" id="dropdown-basic">
                                        Connect Wallet
                                    </Dropdown.Toggle>
                                ) : null}
                                {accounts.length > 0 && !selectedAccount ? (
                                    <>
                                        <select onChange={changeAccount}>
                                            <option value="" disabled selected hidden>
                                                Choose account
                                            </option>
                                            {accounts.map((acc, index) => (
                                                <option key={index} value={acc.address}>
                                                    {acc.address}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                ) : null}
                                {selectedAccount ? selectedAccount.address : null}

                                <Dropdown.Menu>

                                    {/* Add dropdown items here */}
                                    <Dropdown.Item >Create Profile</Dropdown.Item>
                                    {/* Add more dropdown items as needed */}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </Container>
            </Navbar>
            <br />
            <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Profile Not Found</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={Cancelbutton}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <figure className='figure'>
                                <img
                                    src='https://assets-v2.lottiefiles.com/a/0e30b444-117c-11ee-9b0d-0fd3804d46cd/AggSTf1DKi.gif'
                                    className='figure-img img-fluid rounded shadow-3 mb-3'
                                    alt='...'
                                />
                            </figure>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={Cancelbutton}>Cancel</MDBBtn>
                            <MDBBtn color='secondary' onClick={CreateProfile}>Create Profile</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>






            <MDBModal staticBackdrop tabIndex='-1' open={basicModal2} onClose={() => setBasicModal2(false)}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Modal title</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleOpen2}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>

                            <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
                                <MDBRadio
                                    name='radioNoLabel'
                                    id='radioNoLabel1'
                                    label='Participant'
                                    value='Participant'
                                    aria-label='...'
                                    className='custom-radio-label'
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
                                <MDBRadio
                                    name='radioNoLabel'
                                    id='radioNoLabel2'
                                    label='Buyer'
                                    value='Buyer'
                                    aria-label='...'
                                    className='custom-radio-label'
                                    onChange={handleChange}
                                />
                            </div>

                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color='danger' onClick={toggleOpen2}>
                                Close
                            </MDBBtn>
                         
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>


        </div>
    );
}

export default Header;
