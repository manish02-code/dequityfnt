import React, { useState } from 'react';
import { MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { injectExtension } from '@polkadot/extension-inject';
import {

  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom"
import { Keyring } from '@polkadot/keyring';
import { decrypt } from "n-krypta";
import axios from 'axios';


const CreateProfileBuyer = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState();
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [loading, setLoading] = useState(false); // State variable for loading state

  const [MessagebasicModal, setMessagebasicModal] = useState(false);
  const [MessaageToAalet, setMessaageToAalet] = useState("")
  const [GifULR, setGifURL] = useState("")


  const [passwordModal, setpasswordModal] = useState(false);
  const [password, setpassword] = useState('')
  const togglePasswordModal = () => setpasswordModal(!passwordModal);


  const [fundrequestStatus, setfundrequestStatus] = useState(false)
  const [bgcolor, setbgcolor] = useState('#eee')



  const navigate = useNavigate();

  const toggleOpen = () => setMessagebasicModal(!MessagebasicModal);



  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(parseInt(e.target.value));
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleEthnicityChange = (e) => {
    setEthnicity(e.target.value);
  };


  const messagemodalOKbtn = () => {
    toggleOpen()
    navigate("/DataBuyer")

  }
  // Decrypt mnemonic
  const decryptMnemonic = async (encryptedData, password) => {
    try {
      const decryptedData = await decrypt(encryptedData, password);
      return decryptedData;
    } catch (error) {
      console.error("Error decrypting mnemonic:", error);
      throw new Error("Failed to decrypt mnemonic");
    }
  };


  const handlePasswordSubmit = async () => {
    setpasswordModal(false);
    setLoading(true); // Set loading state to true when form is submitted

    try {
      await CreateProfile(name, age, gender, ethnicity);
    } catch (error) {
      if (error) {
        console.log("Low Balance", error)

        setMessaageToAalet("Invalid Transaction, Low Balance.")
        setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")


        toggleOpen()
      }
      // console.error("kjhaskjhaskjhsakhdaksdhsakjdhaksjdhskhdkjdhskjdh",error.message);
    } finally {

      setLoading(false); // Set loading state to false after profile creation
    }
  };


  const handleSubmit = async (e) => {

    e.preventDefault();
    setpasswordModal(true);

  };







  const CreateProfile = async (name, age, gender, ethnicity) => {

    try {


      const wsProvider = new WsProvider(process.env.REACT_APP_RELAY); // Replace with your endpoint
      const api = await ApiPromise.create({ provider: wsProvider });

      const selaccnt = localStorage.getItem('Selected Account');
      console.log(selaccnt)

      const keyring = new Keyring({ type: 'sr25519' });

      const encryptedMnemonic = localStorage.getItem(`encryptedMnemonic_${selaccnt}`)
      const tt = await decryptMnemonic(encryptedMnemonic, password)

      const accMnemonic = keyring.addFromUri(tt.mnemonic);


      const result = await api.tx.hrmp.createOfferCreatorProfile(name, age, gender, ethnicity).signAndSend(accMnemonic);

      if (!result || !result.hash) {
        const errorMessage = result?.error?.message || 'Transaction failed';
        setpassword('')
        setfundrequestStatus(false)

        throw Error(errorMessage)
      } else {
        setMessaageToAalet("Transection Sucessfull, Profile Created.")
        setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")
        setpassword('')
        setfundrequestStatus(false)

        toggleOpen()
        // console.log('Profile created. Transaction hash:', result.toPrimitive());
        // Handle success here
      }

    } catch (error) {
      setpassword('')
      console.log(error)

    }

  };



  const requestFunds = async (event) => {
    event.preventDefault();
    try {
      setfundrequestStatus(true);

      const selaccnt = localStorage.getItem('Selected Account');
      console.log(selaccnt);

      const params = {
        address: selaccnt,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_SERVER}/para/AccountFundRequest`, params)
        .then((response) => {
          console.log(response);
          setfundrequestStatus(true);
          setbgcolor('#C8E6C9');
        })
        .catch((error) => {
          console.error(error);
          setfundrequestStatus(false);
          setbgcolor('#f1948a');
        });
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      {loading ? (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
          <MDBSpinner color='primary' />
        </div>
      ) : (
        <div className='d-flex justify-content-center ' style={{ paddingBottom: '20px' }}>
          <MDBCard className='w-50 shadow-3-strong border border-secondary'>
            <MDBCardBody>
              <MDBRow className='justify-content-center'>
                <MDBCol>
                  <div >
                    <MDBInput className='mb-4' type='text' id='form1Example1' label='Name' value={name} onChange={handleNameChange} />
                    <MDBInput className='mb-4' type='number' id='form1Example2' label='Age' min='0' value={age} onChange={handleAgeChange} />
                    <MDBInput className='mb-4' type='text' id='form1Example3' label='Gender' value={gender} onChange={handleGenderChange} />
                    <MDBInput className='mb-4' type='text' id='form1Example4' label='Ethnicity' value={ethnicity} onChange={handleEthnicityChange} />
                    <div style={{
                      backgroundColor: bgcolor,
                      borderRadius: '10px',
                      padding: '10px',
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }} className='mb-4'>
                      <p className="text-muted mb-1" style={{ margin: 0 }}>
                        {localStorage.getItem('Selected Account')}
                      </p>
                      <MDBBtn size='sm' color='warning' style={{ width: '20%', borderRadius: '10px' }} onClick={requestFunds}>
                        Request fund
                      </MDBBtn>
                    </div>

                    {fundrequestStatus ? (
                      <MDBBtn size='sm' color='success' onClick={handleSubmit} block style={{ width: '20%', height: '15%' }}>
                        Create Profile
                      </MDBBtn>
                    ) : (
                      <MDBBtn disabled size='sm' color='#58d68d' block style={{ width: '20%', height: '15%' }}>
                        Create Profile
                      </MDBBtn>
                    )}
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>

          {MessagebasicModal ? (
            <>

              <MDBModal open={MessagebasicModal} onClose={() => setMessagebasicModal(false)} tabIndex='-1'>
                <MDBModalDialog>
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle></MDBModalTitle>
                      <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                      {MessaageToAalet}
                      <figure className='figure'>
                        <img
                          src={GifULR}
                          className='figure-img img-fluid rounded shadow-3 mb-3'
                          alt='...'
                        />
                      </figure>
                    </MDBModalBody>

                    <MDBModalFooter>
                      <MDBBtn color='secondary' onClick={messagemodalOKbtn}>
                        OK
                      </MDBBtn>
                    </MDBModalFooter>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
            </>
          ) : null}


        </div>
      )}



      <>
        <MDBModal staticBackdrop tabIndex='-1' open={passwordModal} onClose={() => setpasswordModal(false)}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Enter Password</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={togglePasswordModal}></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Password'
                  size='lg'
                  type='password'
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </MDBModalBody>
              <MDBModalFooter>

                <MDBBtn onClick={handlePasswordSubmit}>Sign Transaction</MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>



    </>
  );
};

export default CreateProfileBuyer;
