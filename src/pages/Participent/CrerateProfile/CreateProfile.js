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
import { useNavigate } from "react-router-dom";
import {  decrypt } from "n-krypta";
import { Keyring } from '@polkadot/keyring';


const CreateParticipantProfile = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [loading, setLoading] = useState(false); // State variable for loading state

  const [MessagebasicModal, setMessagebasicModal] = useState(false);
  const [MessaageToAalet, setMessaageToAalet] = useState("")
  const [GifULR, setGifURL] = useState("")


  const navigate = useNavigate();

  const toggleOpen = () => setMessagebasicModal(!MessagebasicModal);

  const [passwordModal, setpasswordModal] = useState(false);
  const [password, setpassword] = useState('')
  const togglePasswordModal = () => setpasswordModal(!passwordModal);


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
    navigate("/Perticipent")

  }


  const handlePasswordSubmit = async () => {
    setpasswordModal(false);
    setLoading(true);

    try {
        await CreateProfile(name, age, gender, ethnicity);
    } catch (error) {
        if (error) {
            console.log("Low Balance", error);

            setMessaageToAalet("Invalid Transaction, Low Balance.");
            setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif");

            toggleOpen();
        } else {
            console.error("An error occurred:", error.message);
        }
    } finally {
        setLoading(false);
    }
};




  const handleSubmit = async (e) => {

    e.preventDefault();
    setpasswordModal(true);
   
  };



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
  
  
      const result = await api.tx.hrmp.createParticipantProfile(name, age, gender, ethnicity).signAndSend(accMnemonic);
  
      if (!result || !result.hash) {
        const errorMessage = result?.error?.message || 'Transaction failed';
        setpassword('')
  
        throw Error(errorMessage)
      } else {
        setMessaageToAalet("Transection Sucessfull, Profile Created.")
        setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")
        setpassword('')
  
        toggleOpen()
        // console.log('Profile created. Transaction hash:', result.toPrimitive());
        // Handle success here
      }

    } catch (error) {
      setpassword('')
      console.log(error)
      
    }
   
  };

  return (
    <>
      {loading ? (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
          <MDBSpinner color='primary' />
        </div>
      ) : (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
          <MDBCard className='w-50 shadow-3-strong border border-secondary'>
            <MDBCardBody>
              <MDBRow className='justify-content-center'>
                <MDBCol>
                  <form onSubmit={handleSubmit}>
                    <MDBInput className='mb-4' type='text' id='form1Example1' label='Name' value={name} onChange={handleNameChange} />
                    <MDBInput className='mb-4' type='number' id='form1Example2' label='Age' min='0' value={age} onChange={handleAgeChange} />
                    <MDBInput className='mb-4' type='text' id='form1Example3' label='Gender' value={gender} onChange={handleGenderChange} />
                    <MDBInput className='mb-4' type='text' id='form1Example4' label='Ethnicity' value={ethnicity} onChange={handleEthnicityChange} />
                    <MDBBtn size='sm' type='submit' block style={{ width: '20%', height: '15%' }}>
                      Create Profile
                    </MDBBtn>
                  </form>
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
               
                <MDBBtn onClick={handlePasswordSubmit}>Sing Transaction</MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>


    </>
  );
};

export default CreateParticipantProfile;
