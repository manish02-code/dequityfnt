
import React from "react";

import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBFile,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBCardImage
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useState, useEffect } from "react";

import { ApiPromise, WsProvider } from '@polkadot/api';
import { encodeAddress } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';




export default function ConnectedCollector() {
    const [copyStatusImage, setcopyStatusImage] = useState("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
    const [copyStatusImage2, setcopyStatusImage2] = useState("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
   
    const [GifULR, setGifURL] = useState("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")
    const [addRecordStatus, setaddRecordStatus] = useState(' ')
    const [uploadLoading, setuploadLoading] = useState(false)

    const [ChainID, setChainID] = useState()
    const [parachianConnectionStatus, setparachianConnectionStatus] = useState(false)
    const [sovereignAccount, setsovereignAccount] = useState('')
    const [sudoAccount, setSudoAccout] = useState('')

    const [accountCreatModal3, setaccountCreatModal3] = useState(false);
    const [cntNodeIp, setcntNodeIp] = useState("")
    const accountCreatModalToggle3 = () => setaccountCreatModal3(!accountCreatModal3);

    ///Creat Participant Profile
    const [Participantname, setParticipantname] = useState("")
    const [Participantage, setParticipantage] = useState(null)
    const [Participantgender, setParticipantgender] = useState("")
    const [Participantethnicity, setParticipantethnicity] = useState("")
    const [ParticipantaccountID, setParticipantaccountID] = useState("")
    const [perticipentModal, setperticipentModal] = useState(false);

    const CreateParticipent = () => {
        setParticipantname(" ")
        setParticipantage(null)
        setParticipantgender(" ")
        setParticipantethnicity(" ")
        setParticipantaccountID(" ")
        setperticipentModal(!perticipentModal)
    };


    const addrecordmodal = () => {
        setuploadLoading(!uploadLoading)
        setGifURL("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")
        setaddRecordStatus(" ")

    };


    const createsetParticipant = async () => {
        addrecordmodal()
        setaddRecordStatus("Creating Participant")
        const encodedCallData = getEncodedCallData(Participantname, Participantage, Participantgender, Participantethnicity, ParticipantaccountID)

        const encodedCallDataHex = await createXcmCall(encodedCallData);

    }


    const depositeData= async()=>{
        addrecordmodal()
        setaddRecordStatus("Depositing Data..")
        const encodedCallData = await getDeositdataEncodedCallData("abc","123abc","5EvZp68brb9ta8DH4xbnHemSQijCCYTWN8YfbbT4wKXkPtrH")
        console.log(encodedCallData)

        const encodedCallDataHex = await createXcmCall(encodedCallData);

    }


    const conn = async () => {
        try {

            const wsProvider = new WsProvider(`ws://${cntNodeIp}:8844`); // Replace with your endpoint
            let api = await ApiPromise.create({ provider: wsProvider });

            console.log("Connected to you node")

            setparachianConnectionStatus(true)

            accountCreatModalToggle3()

            return (api)

        } catch (error) {
            console.error("Error fetching offer details:", error);
            setparachianConnectionStatus(false)
        }

    }


    async function getEncodedCallData(Participantname, Participantage, Participantgender, Participantethnicity, ParticipantaccountID) {
        const wsProvider = new WsProvider('ws://3.109.51.55:9944'); // Replace with your endpoint
        let api = await ApiPromise.create({ provider: wsProvider });
    
    
        // Create the extrinsic call
        const call =await api.tx.hrmp.createParticipantProfileXcm(Participantname, Participantage, Participantgender, Participantethnicity, ParticipantaccountID);
    
        // Get the encoded call data
        let encodedCallData = call.toHex();
        
        console.log("Encoded Call Data (not modified): ", encodedCallData);
    
    

    
        return removeBefore3c(encodedCallData);
    }

    
    async function getDeositdataEncodedCallData(ParticipantEnKey, ParticipantIpfsCid,  ParticipantaccountID) {
        const wsProvider = new WsProvider('ws://3.109.51.55:9944'); // Replace with your endpoint
        let api = await ApiPromise.create({ provider: wsProvider });
    
    
        // Create the extrinsic call
        const call =await api.tx.hrmp.depositeDataPWalletXcm(ParticipantEnKey, ParticipantIpfsCid,ParticipantaccountID);
    
        // Get the encoded call data
        let encodedCallData = call.toHex();
        
        console.log("Encoded Call Data (not modified): ", encodedCallData);
    
    
        return removeBefore3c(encodedCallData);
    }






    async function removeBefore3c(encodedCallData) {
        const encodedCallDataStr = await encodedCallData;

        const index = encodedCallDataStr.indexOf('3c');
        if (index ) {
            return '0x' + encodedCallDataStr.substring(index);
        } else {
            throw new Error('"3c" not found in the encoded call data');
        }
    }



 





    async function createXcmCall(encodedCallData) {
        try {
            const endcalldata = await encodedCallData;
            console.log('Encoded Call Data:', endcalldata);
    
            const wsProvider = new WsProvider(`ws://${cntNodeIp}:8844`);
            const api = await ApiPromise.create({ provider: wsProvider });
    
            const dest = {
                "V2": {
                    "parents": 1,
                    "interior": "Here"
                }
            };
    
            const messages = {
                "V2": [
                    {
                        "WithdrawAsset": [
                            {
                                "id": {
                                    "Concrete": {
                                        "parents": 0,
                                        "interior": "Here"
                                    }
                                },
                                "fun": {
                                    "Fungible": 1000000000000
                                }
                            }
                        ]
                    },
                    {
                        "BuyExecution": {
                            "fees": {
                                "id": {
                                    "Concrete": {
                                        "parents": 0,
                                        "interior": "Here"
                                    }
                                },
                                "fun": {
                                    "Fungible": 1000000000000
                                }
                            },
                            "weightLimit": "Unlimited"
                        }
                    },
                    {
                        "Transact": {
                            "originType": "Native",
                            "requireWeightAtMost": 40000000000,
                            "call": {
                                "encoded": endcalldata
                            } 
                        }
                    },
                    { "RefundSurplus": {} },
                    {
                        "DepositAsset": {
                            "assets": {
                                "Wild": "All"
                            },
                            "maxAssets": 1,
                            "beneficiary": {
                                "parents": 0,
                                "interior": {
                                    "X1": {
                                        "Parachain": 2000
                                    }
                                }
                            }
                        }
                    }
                ]
            };
    
            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri(process.env.ALICE_URI || '//Alice');
    
            const xcmCall = api.tx.polkadotXcm.send(dest, messages);
            setaddRecordStatus('Sending Transection');
    
            const unsub = await api.tx.sudo.sudo(xcmCall).signAndSend(alice, { nonce: -1 }, ({ status, events, dispatchError }) => {
                if (status.isInBlock) {
                    console.log(`Transaction included at blockHash ${status.asInBlock}`);
                    setaddRecordStatus("Transaction Include in Block")
                } else if (status.isFinalized) {
                    console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
                    setaddRecordStatus("Transaction finalized")
                    setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")
                    unsub();
                } else {
                    console.log(`Transaction status: ${status.type}`);
                    setaddRecordStatus(`Transaction status: ${status.type}`)
                   
                } 

    
                if (dispatchError) {
                    if (dispatchError.isModule) {
                        const decoded = api.registry.findMetaError(dispatchError.asModule);
                        const { documentation, name, section } = decoded;
                        console.error(`Error: ${section}.${name}: ${documentation.join(' ')}`);
                        setaddRecordStatus("Something is Worong")
                        setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
                    } else {
                        console.error(`Error: ${dispatchError.toString()}`);
                        setaddRecordStatus("Something is Worong")
                        setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
                    }
                }
    
                events.forEach(({ event: { method, section }, phase, event }) => {
                    console.log(`\t${phase.toString()}: ${section}.${method}:: ${event.data.toString()}`);
                });
            });
    
        } catch (error) {
            console.error('Error creating XCM call:', error);
            setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
        }
    }
    
    

    async function sendXcmCall(encodedCallDataHex) {
        try {
            const wsProvider = new WsProvider(`ws://${cntNodeIp}:8844`);
            const api = await ApiPromise.create({ provider: wsProvider });

            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri('//Alice');

            // Create the call from the encoded data
            const call = api.tx(encodedCallDataHex);

            console.log('Created call from encoded data:', call.toHuman());

            // Sign and send the transaction
            const hash = await call.signAndSend(alice);

            console.log('Transaction sent with hash:', hash.toHex());
        } catch (error) {
            console.error('Error sending XCM call:', error);
        }
    }






    useEffect(() => {
        if (parachianConnectionStatus == false) {
            accountCreatModalToggle3()
        }

    }, []);







    return (<>

        <div className="page-container">
            <div>
                <MDBCard
                    className='my-4'
                    style={{
                        maxWidth: '1200px',
                        margin: 'auto',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        paddingTop: '20px',  // Add top padding here
                        paddingLeft: '20px'  // Add left padding here
                    }}
                >
                    <MDBRow className='g-0'>
                        <MDBCol lg="5">
                            <MDBCard className="mb-4" style={{
                                border: '1px solid rgba(0, 0, 0, 0.1)',  // Add solid border here
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' // Add shadow here
                            }}>
                                <MDBCardBody className="text-center">


                                    {parachianConnectionStatus ? (<div
                                        style={{
                                            backgroundColor: `#B9EDCB`,
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <p className="text-muted mb-1">
                                            Connected {ChainID}
                                        </p>
                                        <p className="text-muted mb-1"></p>
                                    </div>) : (<div
                                        style={{
                                            backgroundColor: `#FB5558`,
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <p className="text-muted mb-1">
                                            Disconnected {ChainID}
                                        </p>
                                        <p className="text-muted mb-1"></p>
                                    </div>

                                    )}




                                    <div
                                        style={{
                                            backgroundColor: '#eee',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <p className="text-muted mb-1">Balance: ABCdfsdfsd DQT</p>
                                        <p className="text-muted mb-1"></p>
                                    </div>

                                    <div
                                        style={{
                                            backgroundColor: '#eee',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px',
                                            position: 'relative'
                                        }}
                                    >
                                        <p className="text-muted mb-1">Sovereign Account: </p>
                                        <p className="text-muted mb-1">{sovereignAccount}</p>

                                        <button
                                            className="btn btn-secondary btn-sm"
                                            style={{
                                                position: 'absolute',
                                                bottom: '5px',
                                                right: '5px',
                                                marginTop: '10px'
                                            }}
                                            onClick={() => {
                                                navigator.clipboard.writeText("ABCdfsdfsd");
                                                setcopyStatusImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpyPyEOzpIz1YAp9NEt84w7-gGaEkuwQ0jgMa7_OBpvlE_pMoC6kiQiHthu-yu1ffHs7o&usqp=CAU")
                                            }}
                                        >
                                            <figure
                                                className='figure'
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    margin: '0'
                                                }}
                                            >
                                                <img
                                                    src={copyStatusImage}
                                                    className='figure-img img-fluid rounded shadow-3 mb-3'
                                                    alt='...'
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </figure>
                                        </button>
                                    </div>

                                    <div
                                        style={{
                                            backgroundColor: '#eee',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px',
                                            position: 'relative'
                                        }}
                                    >
                                        <p className="text-muted mb-1">Sudo Account: </p>
                                        <p className="text-muted mb-1">{sudoAccount}</p>

                                        <button
                                            className="btn btn-secondary btn-sm"
                                            style={{
                                                position: 'absolute',
                                                bottom: '5px',
                                                right: '5px',
                                                marginTop: '10px'
                                            }}
                                            onClick={() => {
                                                navigator.clipboard.writeText("ABCdfsdfsd");
                                                setcopyStatusImage2("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpyPyEOzpIz1YAp9NEt84w7-gGaEkuwQ0jgMa7_OBpvlE_pMoC6kiQiHthu-yu1ffHs7o&usqp=CAU")
                                            }}
                                        >
                                            <figure
                                                className='figure'
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    margin: '0'
                                                }}
                                            >
                                                <img
                                                    src={copyStatusImage2}
                                                    className='figure-img img-fluid rounded shadow-3 mb-3'
                                                    alt='...'
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </figure>
                                        </button>
                                    </div>

                                    <div
                                        style={{
                                            backgroundColor: '#eee',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div>
                                            <MDBBtn size="lg" rounded className='bg-warning' onClick={CreateParticipent}>
                                                Create Participant
                                            </MDBBtn>
                                        </div>
                                        <div>
                                            <MDBBtn size="lg" rounded className='bg-success' onClick={depositeData}>
                                                Deposite Data
                                            </MDBBtn>
                                        </div>
                                    </div>


                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBCard>
            </div>

            <MDBModal staticBackdrop tabIndex='-1' open={accountCreatModal3} onClose={() => setaccountCreatModal3(false)}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Enter Detail </MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={accountCreatModalToggle3}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Enter your Node IP Address'
                                size='lg'
                                type='text'
                                value={cntNodeIp}
                                onChange={(e) => setcntNodeIp(e.target.value)}
                            />
                            <MDBBtn onClick={conn}>Connect</MDBBtn>
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>




            <MDBModal staticBackdrop tabIndex='-1' open={perticipentModal} onClose={() => setperticipentModal(false)}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Enter Detail </MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={CreateParticipent}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Name'
                                size='lg'
                                type='text'
                                value={Participantname}
                                onChange={(e) => setParticipantname(e.target.value)}
                            />
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Age'
                                size='lg'
                                type='Number'
                                value={Participantage}
                                onChange={(e) => setParticipantage(e.target.value)}
                            />

                            <MDBInput
                                wrapperClass='mb-4'
                                label='Gender'
                                size='lg'
                                type='text'
                                value={Participantgender}
                                onChange={(e) => setParticipantgender(e.target.value)}
                            />
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Ethnicity'
                                size='lg'
                                type='text'
                                value={Participantethnicity}
                                onChange={(e) => setParticipantethnicity(e.target.value)}
                            />
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Enter AccountID Of Participant'
                                size='lg'
                                type='text'
                                value={ParticipantaccountID}
                                onChange={(e) => setParticipantaccountID(e.target.value)}
                            />



                            <MDBBtn onClick={createsetParticipant}>Create Accoount</MDBBtn>
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>



            
          {uploadLoading ? (
            <>

              <MDBModal staticBackdrop open={uploadLoading}  tabIndex='-1'>
                <MDBModalDialog >
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle></MDBModalTitle>
                      <MDBBtn className='btn-close' color='none' onClick={addrecordmodal}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                      <div>
                        <h3 style={{ fontSize: '1.5rem' }}>{addRecordStatus}</h3>
                        <figure className='figure'>
                          <img
                            src={GifULR}
                            className='figure-img img-fluid rounded shadow-3 mb-3'
                            alt='...'
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </figure>
                      </div>

                    </MDBModalBody>

                    <MDBModalFooter>
                      <MDBBtn color='danger' onClick={addrecordmodal} >
                        Cancel
                      </MDBBtn>
                    </MDBModalFooter>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
            </>
          ) : null}




        </div>


    </>)

}