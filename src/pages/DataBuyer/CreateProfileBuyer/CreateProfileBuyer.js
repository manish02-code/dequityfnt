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


const CreateProfileBuyer = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [loading, setLoading] = useState(false); // State variable for loading state

  const [MessagebasicModal, setMessagebasicModal] = useState(false);
  const [MessaageToAalet, setMessaageToAalet]=useState("")
  const [GifULR, setGifURL]=useState("")


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


  const messagemodalOKbtn =()=>{
    toggleOpen()
    navigate("/Perticipent")

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when form is submitted

    try {
      await CreateProfile(name, age, gender, ethnicity);
    } catch (error) {
      if (error){
        console.log("Low Balance")

        setMessaageToAalet("Invalid Transaction, Low Balance.")
        setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")


        toggleOpen()
      }
      // console.error("kjhaskjhaskjhsakhdaksdhsakjdhaksjdhskhdkjdhskjdh",error.message);
    } finally {

      setLoading(false); // Set loading state to false after profile creation
    }
  };




  

  const CreateProfile = async (name, age, gender, ethnicity) => {
    const wsProvider = new WsProvider('ws://3.109.51.55:9944'); // Replace with your endpoint
    const api = await ApiPromise.create({ provider: wsProvider });

    const selaccnt = localStorage.getItem('Selected Account');
    console.log(selaccnt)
    const injector = await web3FromAddress(selaccnt);

    const result = await api.tx.hrmp.createOfferCreatorProfile(name, age, gender, ethnicity).signAndSend(selaccnt, { signer: injector.signer });

    if (!result || !result.hash) {
      const errorMessage = result?.error?.message || 'Transaction failed';

      throw Error(errorMessage)
    } else {
      setMessaageToAalet("Transection Sucessfull, Profile Created.")
      setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")


        toggleOpen()
      // console.log('Profile created. Transaction hash:', result.toPrimitive());
      // Handle success here
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

    </>
  );
};

export default CreateProfileBuyer;
