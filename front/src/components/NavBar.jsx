import {useEffect, useState} from "react";
import {Navbar, Container, NavDropdown, Nav, Form, InputGroup} from 'react-bootstrap'
import {LogOut, Search} from "react-feather";
import '../styles/navbar.css'
import logo from "../assets/logo-recetario.jpg"
import { useNavigate } from "react-router";

const NavBar = ({ isAdmin }) => {
    const [user, setUser] = useState()
    const navigate = useNavigate(); 

    useEffect(() => {
        const name = localStorage.getItem("user") || "Usuario"
        setUser(name)
    }, [])

    const logout = () => {
        navigate('/'); 
    }

    return (
        <Navbar className="bg-blue fixed-top">
            <Container>
                <Navbar.Brand className="text-primary">
                    <img className="img-logo" src={ logo } alt=""/>
                    Recetario
                </Navbar.Brand>
                <Nav className="ms-auto">
                    <Form inline className="me-3">
                        <InputGroup>
                            <Form.Control
                                placeholder="Busqueda"
                                aria-label="Username"
                            />
                            <InputGroup.Text><Search size={20}/></InputGroup.Text>
                        </InputGroup>
                    </Form>
                    <NavDropdown title={ <span className="text-primary">{ user }</span> } align="end" className="custom-dropdown">
                        {isAdmin ? (
                            <>
                                <NavDropdown.Item href="/">Recetas</NavDropdown.Item>
                                <NavDropdown.Item href="/">Usuarios</NavDropdown.Item>
                            </>
                        ) : (
                            <>
                                <NavDropdown.Item href="/">Crear Receta</NavDropdown.Item>
                                <NavDropdown.Item href="/">Mis Recetas</NavDropdown.Item>
                                <NavDropdown.Item href="/">Comentarios Realizados</NavDropdown.Item>
                                <NavDropdown.Item href="/">Calificaciones Realizadas</NavDropdown.Item>
                            </>
                        )}
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={ logout }>Cerrar Sesión <LogOut size={16} className="mx-3"/></NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar