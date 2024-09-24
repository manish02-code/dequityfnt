import React, { useState, useEffect } from 'react';
import "./DataBuyer.css";
import { Buffer } from 'buffer';
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
  MDBModalFooter, MDBFile, MDBCheckbox
} from 'mdb-react-ui-kit';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { injectExtension } from '@polkadot/extension-inject';
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios';
import { Keyring } from '@polkadot/keyring';
import { decrypt } from "n-krypta";
import { formatBalance } from '@polkadot/util';

export default function DataBuyer() {
  const [selectedAccount, setSelectedAccount] = useState(localStorage.getItem('Selected Account'));
  const [profileFetch, setprofileFetch] = useState(true)

  const acc = localStorage.getItem('Selected Account')
  const [accountBalance, setaccountBalance] = useState('')
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
  const [selectedData, setselectedData] = useState([])
  const [selectedID, setselectedID] = useState()
  const [offerStatus, setofferStatus] = useState('')

  const [OfferName, setOfferName] = useState('')
  const [Price, setPrice] = useState()
  const [condition, setcondition] = useState('')
  const [MaxParticipant, setMaxParticipant] = useState()
  const [PricePerParticipant, setPricePerParticipant] = useState()
  const [RSAPublicKey, setRSAPpublicKey] = useState('')
  // const [RSAPublicKey2, setRSAPpublicKey2] = useState('')
  const [checked, setChecked] = useState(false);
  const [passwordModal, setpasswordModal] = useState(false);
  const [password, setpassword] = useState('')
  const [RSAPrivetKey, setRSAPrivetKey] = useState('')

  const [fundRequestStatus, setfundRequestStatus] = useState('Request funds')

  const togglePasswordModal = () => { setpasswordModal(!passwordModal) }

  const [addRecordStatus, setaddRecordStatus] = useState(' ')
  const [uploadLoading, setuploadLoading] = useState(false)
  const [GifULR, setGifURL] = useState("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")

  const [participantModal, setparticipantModal] = useState(false);

  const [toggleOneModal, setToggleOneModal] = useState(false);
  const [toggleTwoModal, setToggleTwoModal] = useState(false);
  const [toggleThridModal, setToggleThirdModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');


  // const filteredData = DataRecord.filter(item => {
  //   return item.cid.includes(searchQuery) || item.key.includes(searchQuery);
  // });



  // console.log(localStorage.getItem('Selected Account Profile'))

  // Convert from Plancks to DOT or your Substrate currency (Human readable)
  const fromPlancks = (balance, decimals = 10) => {
    return formatBalance(balance, { decimals });
  };

  // Convert from DOT or your Substrate currency (Human input) to Plancks (smallest unit)
  // const toPlancks = (balance, decimals = 10) => {
  //   return BigInt(balance * 10 ** decimals);
  // };





  const onrRowClick = (idx) => {

    console.log(idx)
    setselectedData(idx.participantsData)
    setparticipantModal(!participantModal)
    setselectedID(idx.id)
    setofferStatus(idx.status)


  }

  const CreateNewOffer = async () => {
    setuploadLoading(true)
    adddataonChain()
  }


  const offername = (e) => {
    // setencryptedFile(e.target.value);
    setOfferName(e.target.value)
  };


  // const RSAPublicKey2set = (e) => {
  //   // setencryptedFile(e.target.value);
  //   setRSAPpublicKey2(e.target.value)
  // };


  const price = (e) => {
    // setencryptedFile(e.target.value);
    setPrice(e.target.value)
  }

  const setConodition = (e) => {
    // setencryptedFile(e.target.value);
    setcondition(e.target.value)
  }

  const maxparticipant = (e) => {
    // setencryptedFile(e.target.value);
    setMaxParticipant(e.target.value)
  }

  const priceperparticipant = (e) => {
    // setencryptedFile(e.target.value);
    setPricePerParticipant(e.target.value)
  }

  const clickCheckBox = async () => {
    togglePasswordModal()

  }




  function formatRSAPublicKey(key) {
    // Remove any existing PEM headers or footers
    const cleanedKey = key
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s+/g, ''); // Remove all whitespace

    console.log(cleanedKey)

    // Ensure the key is in a valid base64 format
    if (!/^([A-Za-z0-9+/=]+)$/.test(cleanedKey)) {
      throw new Error("Invalid RSA Public Key format");
    }

    // Add the PEM header and footer without trailing whitespace
    const pemFormattedKey = `-----BEGIN PUBLIC KEY----- ${cleanedKey} -----END PUBLIC KEY-----`;

    console.log(pemFormattedKey)



    return pemFormattedKey.trim(); // Remove any trailing whitespace
  }


  const adddataonChain = async () => {
    setaddRecordStatus("Adding Data on the Chain.")
    const wsProvider = new WsProvider(process.env.REACT_APP_RELAY);
    const api = await ApiPromise.create({ provider: wsProvider });

    
    const keyring = new Keyring({ type: 'sr25519' });
    const encryptedMnemonic = localStorage.getItem(`encryptedMnemonic_${selectedAccount}`)


    const tt = await decryptMnemonic(encryptedMnemonic, password)
    // console.log(tt.rsaPublicKey)
    // console.log("fhkjfhdskjfhskfdhsdkjfh", RSAPublicKey)

    const accMnemonic = keyring.addFromUri(tt.mnemonic);
    if (!selectedAccount) {
      console.error("No account selected. Please select an account.");
      return;
    }
    if (!OfferName && !condition && !MaxParticipant & !PricePerParticipant) {
      console.error("Missing encryption OfferName,Condition, MaxParticipant, PricePerParticipant, RSAPublicKey  or Price.")

      setaddRecordStatus("Missing encryption OfferName,Condition or Price.")
      setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
      return;

    }

    try {
      const formatedRSAKey = formatRSAPublicKey(RSAPublicKey)
      const amountInPlancks = BigInt(PricePerParticipant * 10 ** 12);
      console.log(amountInPlancks)

      const data = await api.tx.hrmp.createOffer(OfferName, condition, formatedRSAKey, MaxParticipant, amountInPlancks).signAndSend(accMnemonic);;
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
    const wsProvider = new WsProvider(process.env.REACT_APP_RELAY); // Replace with your endpoint
    let api;

    if (!selectedAccount) {
      console.error("No account selected. Please select an account.");
      return;
    }


   

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
        details.push(result);
      }

      setOfferDetails(details);
    

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
      }).then(res => {
        window.alert(res.data)
        setfundRequestStatus("Fund send Sucessfull")
      })

    } catch (error) {
      console.log(error)

    }
  }




  //This Function use Take RSA key of User
  const handlePasswordSubmit = async (e) => {
    // setencryptedFile(e.target.value);
    const keyring = new Keyring({ type: 'sr25519' });
    const selaccnt = localStorage.getItem('Selected Account');
    console.log(selaccnt)

    const encryptedMnemonic = localStorage.getItem(`encryptedMnemonic_${selaccnt}`)
    const tt = await decryptMnemonic(encryptedMnemonic, password)


    setRSAPpublicKey(tt.rsaPublicKey)

    setRSAPrivetKey(tt.rsaPrivateKey)



    togglePasswordModal()

    setChecked(true)
  };





  const finalizeOffer = async () => {
    // Toggle the password modal
    setToggleOneModal(true)


  };

  const finalize = async () => {
    try {
      setuploadLoading(true); // Set loading state
      endoffer(); // Perform the offer finalization
    } catch (error) {
      console.error("Error finalizing offer:", error);
    }
  };


  const endoffer = async () => {
    setChecked(false);
    setToggleThirdModal(!toggleThridModal);
    setparticipantModal(false)
    setaddRecordStatus("Finalizing the Offer. Please Wait...")
    const wsProvider = new WsProvider(process.env.REACT_APP_RELAY);
    const api = await ApiPromise.create({ provider: wsProvider });

    // await web3Enable("Manish")
    // const selaccnt = localStorage.getItem('Selected Account');
    // const injector = await web3FromAddress(selaccnt);

    const keyring = new Keyring({ type: 'sr25519' });
    const encryptedMnemonic = localStorage.getItem(`encryptedMnemonic_${selectedAccount}`)


    const tt = await decryptMnemonic(encryptedMnemonic, password)

    const accMnemonic = keyring.addFromUri(tt.mnemonic);
    if (!selectedID) {
      console.error("No selected ID. Please select an ID.");
      setaddRecordStatus("Offer Ended Sucessfully")
      setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
      return;
    }

    try {

      const data = await api.tx.hrmp.finalizeOffer(selectedID).signAndSend(accMnemonic);;
      const result = data.toPrimitive()
      console.log(result)
      setaddRecordStatus("Offer Ended Sucessfully")
      setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      api.disconnect(); // Disconnect from the Polkadot node after fetching data
      setpassword('')
    }

  }


  const DecrytpandDownload = async (cid1, encKey) => {
    try {
      setpasswordModal(true);

      const response = await axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER}/IpfsKEys/Decryptfils`, {
        cid: cid1,
        key: encKey,
        RSaPVtKey: RSAPrivetKey
      });

      console.log(response);

      const { file, filename, mimeType } = response.data;
      console.log(response.data)

      // Convert base64 string to binary data
      const binaryString = atob(file);
      const binaryLength = binaryString.length;
      const bytes = new Uint8Array(binaryLength);
      for (let i = 0; i < binaryLength; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
    }
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

        const { data: balance } = await api.query.system.account(accountAdddress);
      

        const formattedBalance = formatBalance(balance.free, { decimals: 12, withUnit: 'DQT' });
        setaccountBalance(formattedBalance)

        const d = await FecthingOfferDeatils(result.offerId)




      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        api.disconnect(); 
      }
    };

    FecthProfile()
  }, []); // Empty dependency array to run only once




  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-1">

        <MDBRow>

          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                {/* <MDBCardImage
                  src="https://ih1.redbubble.net/image.3975105605.5329/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid /> */}
                <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '2px' }}>
                  <p className="text-muted mb-1">Balance: {accountBalance} </p>
                  <p className="text-muted mb-1"></p>
                </div>
                <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '5px', position: 'relative' }}>
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

                <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
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

                {/* <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <MDBBtn size="lg" rounded className='bg-success' onClick={requestFunds} >
                      {fundRequestStatus}
                    </MDBBtn>
                  </div>

                </div> */}

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



            <MDBCard className="mb-4" style={{ width: 'calc(100% - 30px)', margin: 'auto', marginTop: '20px' }}>
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
                                <th scope='col'>Status</th>
                                <th scope='col'> </th>
                              </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                              {OfferDetails.map((item, idx) => (
                                <tr key={idx} className="hover-row" onClick={() => onrRowClick(item)}>
                                  <th scope='row'>{item.id}</th>
                                  <td>{item.name}</td>
                                  <td> { formatBalance(item.pricePerParticipant, { decimals: 12, withUnit: 'DQT' }) }</td>
                                  <td>{item.condition}</td>
                                  {item.status == "Active" ? (<td style={{ color: 'white', backgroundColor: "#4caf50", borderRadius: '30px' }}>{item.status}</td>) : (
                                    <td style={{ color: 'white', backgroundColor: "#FF5733", borderRadius: '30px' }}>{item.status}</td>
                                  )}

                                  {/* <td>
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
                                  </td> */}
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
                <MDBInput label="Enter condition " id="form1" type="text" value={condition} onChange={setConodition} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <MDBInput label="Maximum Participant " id="form1" type="Number" value={MaxParticipant} onChange={maxparticipant} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <MDBInput label="Price Per Participant " id="form1" type="Number" value={PricePerParticipant} onChange={priceperparticipant} />
              </div>
              {/* <div style={{ marginBottom: '20px' }}>
                <MDBInput label="Enter RSA Key " id="form1" type="text" value={RSAPublicKey2} onChange={RSAPublicKey2set} />
              </div> */}

              <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px', position: 'relative', marginBottom: '20px' }}>
                <MDBCheckbox
                  className='custom-checkbox'
                  id='checkNoLabel'
                  label='Use My RSA Key'
                  checked={checked}
                  onChange={clickCheckBox}
                />
                {/* <MDBInput label="Enter RSA Public " id="form1" type="text" value={RSApublicKey} onChange={userRSAPublicKey} /> */}
              </div>


            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='danger' onClick={() => {
                setScrollableModal(!scrollableModal);
                setOfferName('');
                setPrice('');
                setcondition('');
                setMaxParticipant('');
                setPricePerParticipant('');
                setChecked(false)
              }}>
                Cancel
              </MDBBtn>
              {checked === true ? (
                <MDBBtn onClick={CreateNewOffer}>Create Offer</MDBBtn>
              ) : (
                <MDBBtn disabled onClick={CreateNewOffer}>Create Offer</MDBBtn>
              )}
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



      <MDBModal open={participantModal} onClose={() => setparticipantModal(false)} tabIndex='1'>
        <MDBModalDialog scrollable style={{ maxWidth: '90%' }}>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Offer Detail</MDBModalTitle>

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

                    {OfferIds === 0 ? (<>No Data Found</>) : (<>



                      {selectedData.map((item, idx) => (
                        <tr key={idx} className="hover-row">
                          <th scope='row'>{idx + 1}</th>
                          <td>{item.address}</td>
                          <td>{item.data[0].cid.slice(0, 4)}...{item.data[0].cid.slice(-10)}</td>

                          <td>{item.data[0].key.slice(0, 4)}...{item.data[0].key.slice(-20)}</td>

                          <td>
                            <MDBBtn color='link' size='sm' onClick={() => DecrytpandDownload(item.data[0].cid, item.data[0].key)}>
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
                    </>


                    )}



                  </MDBTableBody>


                </MDBTable>
              </div>




            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='warning' onClick={() => setparticipantModal(!participantModal)}>
                Close
              </MDBBtn>

              {offerStatus == "Finished" && OfferDetails.length !== 0 ? (
                <MDBBtn disabled color='success'>Offer alredy Ends</MDBBtn>

              ) : (
                <MDBBtn color='success' onClick={() => setToggleOneModal(!toggleOneModal)}  >
                  End Offer
                </MDBBtn>

              )}
              {/* <MDBBtn onClick={() => finalizeOffer()}>End Offer</MDBBtn> */}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>




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




      <>
        {/* <MDBBtn onClick={() => setToggleOneModal(!toggleOneModal)}>OPEN FIRST MODAL</MDBBtn> */}

        <MDBModal staticBackdrop open={toggleOneModal} onClose={() => setToggleOneModal(false)} tabIndex='1'>
          <MDBModalDialog centered>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Confirm Offer Finalizing</MDBModalTitle>
                <MDBBtn
                  className='btn-close'
                  color='none'
                  onClick={() => setToggleOneModal(!toggleOneModal)}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>

                <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px', position: 'relative', marginBottom: '20px' }}>
                  <MDBCheckbox
                    className='custom-checkbox'
                    id='checkNoLabel'
                    label='I Confirm To End This Offer'
                    checked={checked}
                    onChange={() => { setChecked(!checked) }}
                  />
                </div>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn
                  onClick={() => {
                    setToggleOneModal(!toggleOneModal);
                    setTimeout(() => {
                      setToggleTwoModal(!toggleTwoModal);
                    }, 400);
                  }}
                >
                  Next
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>

        <MDBModal staticBackdrop open={toggleTwoModal} onClose={() => setToggleTwoModal(false)} tabIndex='1'>
          <MDBModalDialog centered>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Enter Your Password</MDBModalTitle>
                <MDBBtn
                  className='btn-close'
                  color='none'
                  onClick={() => setToggleTwoModal(!toggleTwoModal)}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
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

              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn
                  onClick={() => {
                    setToggleTwoModal(!toggleTwoModal);
                    setTimeout(() => {
                      setToggleThirdModal(!toggleThridModal);
                    }, 400);
                  }}
                >
                  Next
                </MDBBtn>
                {/* <MDBBtn onClick={()=>{handlePasswordSubmit()}}>Next</MDBBtn> */}
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>




        <MDBModal staticBackdrop open={toggleThridModal} onClose={() => setToggleTwoModal(false)} tabIndex='1'>
          <MDBModalDialog centered>
            <MDBModalContent>
              <MDBModalHeader>

                <MDBBtn
                  className='btn-close'
                  color='none'
                  onClick={() => setToggleThirdModal(!toggleThridModal)}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>

                <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '5px', position: 'relative' }}>
                  <p className="text-muted mb-5">Are You Sure you want to end this Offer?  </p>


                  <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '5px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <div>
                      <MDBBtn size="lg" rounded className='bg-warning' onClick={() => {
                        setToggleThirdModal(!toggleThridModal);
                        setTimeout(() => {
                          setToggleTwoModal(!toggleTwoModal);
                        }, 400);
                      }}>
                        No
                      </MDBBtn>
                    </div>
                    <div>
                      <MDBBtn size="lg" rounded className='bg-success' onClick={() => { finalize() }}>
                        Yes
                      </MDBBtn>
                    </div>
                  </div>


                </div>


              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>



      </>



    </section >
  );
}
