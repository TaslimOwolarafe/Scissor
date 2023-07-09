import { React, useState} from "react";
import {
    MDBContainer,
    // MDBCard,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBCollapse,
    MDBIcon,
} from "mdb-react-ui-kit";

function Header() {

    const [showNav, setShowNav] = useState(false);
    return (
        <MDBNavbar expand="lg" light bgColor="light">
                <MDBContainer>
                    <MDBNavbarBrand href="#">Scissor</MDBNavbarBrand>
                    <MDBNavbarToggler
                        type="button"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={() => setShowNav(!showNav)}
                    >
                        <MDBIcon icon="bars" fas />
                    </MDBNavbarToggler>
                    <MDBCollapse navbar show={showNav}>
                        <MDBNavbarNav>
                            <MDBNavbarItem>
                                <MDBNavbarLink active aria-current="page" href="/signup">
                                    Signup
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink href="/login">Login</MDBNavbarLink>
                            </MDBNavbarItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
    )
}

export default Header