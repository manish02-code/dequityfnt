import React from "react";
import { MDBCarousel, MDBCarouselItem } from 'mdb-react-ui-kit';

export default function Homepage(){
    return(
        <div style={{paddingBottom:"30px"}}  >
            <MDBCarousel showControls fade interval={2000} style={{ maxWidth: '1200px', margin: 'auto', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.1)'}}>
                <MDBCarouselItem itemId={1} >
                    <img src='https://mdbootstrap.com/img/new/slides/041.jpg' className='d-block w-100' alt='...' style={{ maxHeight: '400px', objectFit: 'cover', borderRadius: '10px' }} />
                </MDBCarouselItem>
                <MDBCarouselItem itemId={2}>
                    <img src='https://mdbootstrap.com/img/new/slides/042.jpg' className='d-block w-100' alt='...' style={{ maxHeight: '400px', objectFit: 'cover', borderRadius: '10px' }} />
                </MDBCarouselItem>
                <MDBCarouselItem itemId={3}>
                    <img src='https://mdbootstrap.com/img/new/slides/043.jpg' className='d-block w-100' alt='...' style={{ maxHeight: '400px', objectFit: 'cover', borderRadius: '10px' }} />
                </MDBCarouselItem>
            </MDBCarousel>


            





        </div>
    )
}
