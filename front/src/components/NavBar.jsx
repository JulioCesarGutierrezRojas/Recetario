import { useEffect, useState } from "react";
import { Navbar, Container, NavDropdown, Nav, Form, InputGroup } from 'react-bootstrap'
import { LogOut, Search } from "react-feather";
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
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('user')
        navigate('/');
    }

    return (
        <Navbar className="bg-navbar fixed-top">
            <Container>
                <Navbar.Brand className="text-secondary">
                    <img className="img-logo" src={logo} alt="" />
                    Recetario
                </Navbar.Brand>
                <Nav className="ms-auto">
                    <Form className="d-inline me-3">
                        <InputGroup>
                            <Form.Control
                                placeholder="Busqueda"
                                aria-label="Username"
                            />
                            <InputGroup.Text><Search size={20} /></InputGroup.Text>
                        </InputGroup>
                    </Form>
                    <NavDropdown title={<span className="text-secondary">{user}</span>} align="end" className="custom-dropdown">
                        {isAdmin ? (
                            <>
                                <NavDropdown.Item onClick={() => navigate("/myrecipes")}>
                                    Mis Recetas
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/">Usuarios</NavDropdown.Item>
                            </>
                        ) : (
                            <>
                                <NavDropdown.Item href="/">Crear Receta</NavDropdown.Item>
                                <NavDropdown.Item href="/myrecipes">Mis Recetas</NavDropdown.Item>
                                <NavDropdown.Item href="/">Comentarios Realizados</NavDropdown.Item>
                                <NavDropdown.Item href="/">Calificaciones Realizadas</NavDropdown.Item>
                            </>
                        )}
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={logout}>Cerrar Sesión <LogOut size={16} className="mx-3" /></NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar