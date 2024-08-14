import React, { useState, useEffect } from 'react';
import "./DataBuyer.css";
import {
  MDBCol,
  MDBInput,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBModalTitle,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter, MDBFile
} from 'mdb-react-ui-kit';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { injectExtension } from '@polkadot/extension-inject';
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios';

export default function DataBuyer() {
  const [selectedAccount, setSelectedAccount] = useState("Test");
  const [profileFetch, setprofileFetch] = useState(true)

  const acc = localStorage.getItem('Selected Account')
  const [accountBalance, setaccountBalance] = useState(0)
  const [accountAdddress, setaccountAdddress] = useState(acc)
  const [copyStatusImage, setcopyStatusImage] = useState("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
  const [name, setname] = useState()
  const [age, setage] = useState(1)
  const [Gender, setgender] = useState()
  const [Ethenicity, setEthenicity] = useState()
  const [DataRecord, setDataRecord] = useState([])
  const [scrollableModal, setScrollableModal] = useState(false);
  const [OfferIds, setOfferIds] = useState([]);
  const [OfferDetails, setOfferDetails] = useState([]);
  const[selectedData,setselectedData]=useState([])


  const [OfferName, setOfferName] = useState('')
  const [Price, setPrice] = useState()
  const [condition, setcondition] = useState('')

  const[fundRequestStatus,setfundRequestStatus]=useState('Request funds')


  const [addRecordStatus, setaddRecordStatus] = useState(' ')
  const [uploadLoading, setuploadLoading] = useState(false)
  const [GifULR, setGifURL] = useState("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")

  const [participantModal, setparticipantModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  // const filteredData = DataRecord.filter(item => {
  //   return item.cid.includes(searchQuery) || item.key.includes(searchQuery);
  // });



  // console.log(localStorage.getItem('Selected Account Profile'))

  const onrRowClick = (idx) => {
    console.log(idx.participantsData)
    setselectedData(idx.participantsData)
    setparticipantModal(!participantModal)


  }

  const CreateNewOffer = async () => {
    setuploadLoading(true)
    adddataonChain()
  }


  const offername = (e) => {
    // setencryptedFile(e.target.value);
    setOfferName(e.target.value)
  };

  const price = (e) => {
    // setencryptedFile(e.target.value);
    setPrice(e.target.value)
  }

  const setConodition = (e) => {
    // setencryptedFile(e.target.value);
    setcondition(e.target.value)
  }


  const adddataonChain = async () => {
    setaddRecordStatus("Adding Data on the Chain.")
    const wsProvider = new WsProvider(process.envs.REACT_APP_RELAY); // Replace with your endpoint
    const api = await ApiPromise.create({ provider: wsProvider });
    await web3Enable("Manish")
    const selaccnt = localStorage.getItem('Selected Account');
    const injector = await web3FromAddress(selaccnt);

    if (!selectedAccount) {
      console.error("No account selected. Please select an account.");
      return;
    }
    if (!OfferName && !Price && !condition) {
      console.error("Missing encryption OfferName,Condition or Price.")

      setaddRecordStatus("Missing encryption OfferName,Condition or Price.")
      setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
      return;

    }

    try {
      const data = await api.tx.hrmp.createOffer(OfferName, Price, condition).signAndSend(selaccnt, { signer: injector.signer });;
      const result = data.toPrimitive()
      console.log(result)
      setaddRecordStatus("Rocord Added Sucessfully")
      setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      api.disconnect(); // Disconnect from the Polkadot node after fetching data
    }

  }

  const addrecordmodal = () => setuploadLoading(!uploadLoading);
  const navigate = useNavigate();


  const messagemodalOKbtn = () => {
    addrecordmodal()
    setuploadLoading(false)
    setGifURL("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")
    // location.href = "localhost:3000/DataBuyer";
    navigate("/DataBuyer")

  }


  const FecthingOfferDeatils = async (OfferIds) => {
    const wsProvider = new WsProvider('ws://13.200.30.231:9945'); // Replace with your endpoint
    let api;

    if (!selectedAccount) {
      console.error("No account selected. Please select an account.");
      return;
    }


    console.log(OfferIds)

    if (!OfferIds || OfferIds.length === 0) {
      console.error("No Offer IDs provided.");
      return;
    }

    try {
      api = await ApiPromise.create({ provider: wsProvider });
      const details = [];

      for (let i = 0; i < OfferIds.length; i++) {
        const data = await api.query.hrmp.offerStorage(OfferIds[i]);
        const result = data.toPrimitive();
        console.log(result)
        details.push(result);
      }

      setOfferDetails(details);
      console.log(details);

    } catch (error) {
      console.error("Error fetching offer details:", error);
    } finally {
      if (api) {
        await api.disconnect(); // Disconnect from the Polkadot node after fetching data
      }
    }
  };


  const requestFunds = async (address) => {

    try {
      console.log(accountAdddress)
      await axios.get(`http://${process.env.REACT_APP_BACKEND_SERVER}/para/AccountFundRequest`, {
        body: {
          address: accountAdddress
        }
      }).then(res => { window.alert(res.data) 
        setfundRequestStatus("Fund send Sucessfull")
      })
  
    } catch (error) {
      console.log(error)
  
    }
  }





  useEffect(() => {
    const FecthProfile = async () => {
      const wsProvider = new WsProvider(process.env.REACT_APP_RELAY); // Replace with your endpoint
      const api = await ApiPromise.create({ provider: wsProvider });

      if (!selectedAccount) {
        console.error("No account selected. Please select an account.");
        return;
      }

      try {
        const data = await api.query.hrmp.offerCreatorProfile(accountAdddress);
        const result = data.toPrimitive()
        setname(result.name)
        setage(result.age)
        setgender(result.gender)
        setEthenicity(result.ethnicity)
        setDataRecord(result.data)
        setOfferIds(result.offerId)

        console.log(result.offerId)

        const d = await FecthingOfferDeatils(result.offerId)




      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        api.disconnect(); // Disconnect from the Polkadot node after fetching data
      }
    };

    FecthProfile()
  }, []); // Empty dependency array to run only once




  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-4">

        <MDBRow>

          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://ih1.redbubble.net/image.3975105605.5329/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />
                <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
                  <p className="text-muted mb-1">Balance: {accountBalance} DQT</p>
                  <p className="text-muted mb-1"></p>
                </div>
                <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px', position: 'relative' }}>
                  <p className="text-muted mb-1">Address: </p>
                  <p className="text-muted mb-1">
                    {accountAdddress}
                  </p>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ position: 'absolute', bottom: '5px', right: '5px', marginTop: '10px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(accountAdddress);
                      setcopyStatusImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpyPyEOzpIz1YAp9NEt84w7-gGaEkuwQ0jgMa7_OBpvlE_pMoC6kiQiHthu-yu1ffHs7o&usqp=CAU")
                    }}
                  >
                    <figure className='figure' style={{ width: '30px', height: '30px', margin: '0' }}>
                      <img
                        src={copyStatusImage}
                        className='figure-img img-fluid rounded shadow-3 mb-3'
                        alt='...'
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </figure>
                  </button>
                </div>

                <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <MDBBtn size="lg" rounded className='bg-warning' >
                      Send
                    </MDBBtn>
                  </div>
                  <div>
                    <MDBBtn size="lg" rounded className='bg-success' >
                      Receive
                    </MDBBtn>
                  </div>
                </div>

                <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <MDBBtn size="lg" rounded className='bg-success' onClick={requestFunds} >
                        {fundRequestStatus}
                        </MDBBtn>
                      </div>

                    </div>

              </MDBCardBody>
            </MDBCard>

          </MDBCol>

          <MDBCol lg="8">

            <MDBCard className="mb-4">
              <MDBCardBody className='shadow-2-strong' style={{ backgroundColor: '#B9EDCB', border: '1.5px solid #ccc', borderRadius: '10px', padding: '10px', marginTop: '10px', position: 'relative', marginBottom: '10px', marginLeft: "20px", marginRight: "20px" }}>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{name}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Age</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{age}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Gender</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{Gender}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Ethenicity</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{Ethenicity}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
              </MDBCardBody>
            </MDBCard>



            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol>

                    <MDBBreadcrumb className="rounded-3 p-3 mb-4 shadow-2-strong" style={{ backgroundColor: '#eee', border: '1px solid #ccc' }}>
                      <div className="d-flex justify-content-between w-100 ">
                        <MDBModalTitle>Created Offer</MDBModalTitle>
                        <div className="d-flex align-items-center">
                          <MDBBtn size="sm" rounded className="bg-success d-flex align-items-center shadow-2-strong" onClick={() => setScrollableModal(true)}>
                            <span className="text-lowercase text-yellow me-2 " style={{ fontSize: '1.2rem' }}>Add Data</span>
                            <figure className='figure d-flex justify-content-center' style={{ width: '30px', height: '30px', margin: '0' }}>
                              <img
                                src="https://w7.pngwing.com/pngs/415/49/png-transparent-grass-area-symbol-brand-sign-add-logo-grass-desktop-wallpaper.png"
                                className='figure-img img-fluid rounded-circle '
                                alt='...'
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            </figure>

                          </MDBBtn>
                        </div>
                      </div>
                    </MDBBreadcrumb>


                    {OfferIds.length === 0 ? (

                      <figure className='figure'>
                        <img
                          src='https://cdn.vectorstock.com/i/preview-1x/04/16/no-data-empty-concept-vector-41830416.jpg'
                          className='figure-img img-fluid rounded shadow-3 mb-3'
                          alt='...'
                          style={{ width: '700px', height: '300px' }} // Adjust the width and height as needed
                        />
                      </figure>


                    ) : (
                      <>
                        <input
                          type='text'
                          placeholder='Search Offer'

                          style={{
                            marginBottom: '20px',
                            padding: '5px',
                            width: 'calc(100% - 20px)', // Adjust the width as needed
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            backgroundColor: "#C8E6C9"
                          }}></input>
                        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '10px' }}>
                          <MDBTable align='middle' style={{ backgroundColor: '#eee' }}>
                            <MDBTableHead light>
                              <tr>
                                <th scope='col'>Offer ID</th>
                                <th scope='col'>Name</th>
                                <th scope='col'>Price</th>
                                <th scope='col'>Condition</th>
                                <th scope='col'> </th>
                              </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                              {OfferDetails.map((item, idx) => (
                                <tr key={idx} className="hover-row" onClick={() => onrRowClick(item)}>
                                  <th scope='row'>{item.id}</th>
                                  <td>{item.name}</td>
                                  <td>{item.price}</td>
                                  <td>{item.condition}</td>
                                  <td>
                                    <MDBBtn color='link' size='sm'>
                                      <figure className='figure' style={{ width: '30px', height: '30px', margin: '0' }}>
                                        <img
                                          src="https://png.pngtree.com/png-vector/20190621/ourmid/pngtree-download-icon-graphic-design-template-vector-illustration-png-image_1499700.jpg"
                                          className='figure-img img-fluid rounded shadow-3 mb-3'
                                          alt='...'
                                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                      </figure>
                                    </MDBBtn>
                                  </td>
                                </tr>
                              ))}
                            </MDBTableBody>

                          </MDBTable>
                        </div>
                      </>


                    )}





                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>





          </MDBCol>
        </MDBRow>
      </MDBContainer>




      <MDBModal staticBackdrop open={scrollableModal} onClose={() => setScrollableModal(false)} tabIndex='-1'>
        <MDBModalDialog scrollable centered >
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Add Record</MDBModalTitle>
              <MDBBtn
                className='btn-close'
                color='none'
                onClick={() => setScrollableModal(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>

              <div style={{ marginBottom: '20px' }}>
                <MDBInput label="Enter Name of Offer " id="form1" type="text" value={OfferName} onChange={offername} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <MDBInput label="price " id="form1" type="Number" value={Price} onChange={price} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <MDBInput label="Enter condition " id="form1" type="text" value={condition} onChange={setConodition} />
              </div>

            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='danger' onClick={() => setScrollableModal(!setScrollableModal)}>
                Cancel
              </MDBBtn>
              <MDBBtn onClick={CreateNewOffer}>create Offer</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>


      <MDBModal staticBackdrop open={uploadLoading} onClick={messagemodalOKbtn} tabIndex='-1'>
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
              <MDBBtn color='secondary' onClick={messagemodalOKbtn}>
                OK
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>








      <MDBModal open={participantModal} onClose={() => setparticipantModal(false)} tabIndex='-1'>
  <MDBModalDialog scrollable style={{ maxWidth: '90%' }}>
    <MDBModalContent>
      <MDBModalHeader>
        <MDBModalTitle>Modal title</MDBModalTitle>
        <MDBBtn
          className='btn-close'
          color='none'
          onClick={() => setparticipantModal(false)}
        ></MDBBtn>
      </MDBModalHeader>
      <MDBModalBody>
        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '10px' }}>
          <MDBTable align='middle' style={{ backgroundColor: '#eee', width: '100%' }}>
            <MDBTableHead light>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Address</th>
                <th scope='col'>CID</th>
                <th scope='col'>Key</th>
                <th scope='col'> </th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {selectedData.map((item, idx) => (
                <tr key={idx} className="hover-row">
                  <th scope='row'>{idx+1}</th>
                  <td>{item.address}</td>
                  <td>{item.data[0].cid.slice(0, 4)}...{ item.data[0].cid.slice(-10)}</td>
                  
                  <td>{item.data[0].key.slice(0, 4)}...{ item.data[0].key.slice(-20)}</td>
                
                  <td>
                    <MDBBtn color='link' size='sm'>
                      <figure className='figure' style={{ width: '30px', height: '30px', margin: '0' }}>
                        <img
                          src="https://png.pngtree.com/png-vector/20190621/ourmid/pngtree-download-icon-graphic-design-template-vector-illustration-png-image_1499700.jpg"
                          className='figure-img img-fluid rounded shadow-3 mb-3'
                          alt='...'
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </figure>
                    </MDBBtn>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color='secondary' onClick={() => setparticipantModal(!participantModal)}>
          Close
        </MDBBtn>
        <MDBBtn>Save changes</MDBBtn>
      </MDBModalFooter>
    </MDBModalContent>
  </MDBModalDialog>
</MDBModal>

    </section>
  );
}
