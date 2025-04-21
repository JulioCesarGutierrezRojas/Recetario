import { useEffect, useState } from "react";
import { Navbar, Container, NavDropdown, Nav, Form, InputGroup, Button } from 'react-bootstrap'
import { LogOut, Search } from "react-feather";
import '../styles/navbar.css'
import logo from "../assets/logo-recetario.jpg"
import { useNavigate } from "react-router";

const NavBar = ({ isAdmin }) => {
    const [user, setUser] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem("user") || "Usuario"
        setUser(name)
    }, [])

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('user')
        localStorage.removeItem('user-id')
        navigate('/');
    }

    const handleSearchChange = (e) => {
        const newValue = e.target.value;
        setSearchQuery(newValue);

        // If the search input is cleared, navigate to search results with empty query
        // This will show all recipes
        if (newValue === '') {
            navigate('/search', { state: { searchQuery: '' } });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/search', { state: { searchQuery: searchQuery.trim() } });
        }
    };

    return (
        <Navbar className="bg-navbar fixed-top">
            <Container>
                <Navbar.Brand href="/home" className="text-secondary">
                    <img className="img-logo" src={logo} alt="" />
                    Sabor & Punto
                </Navbar.Brand>
                <Nav className="ms-auto">
                    <Form className="d-inline me-3" onSubmit={handleSearchSubmit}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Busqueda"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <Button 
                                variant="outline-secondary" 
                                type="submit"
                                className="d-flex align-items-center"
                            >
                                <Search size={20} />
                            </Button>
                        </InputGroup>
                    </Form>
                    <NavDropdown title={<span className="text-secondary">{user}</span>} align="end" className="custom-dropdown">
                        {isAdmin ? (
                            <>
                                <NavDropdown.Item onClick={() => navigate("/myrecipes")}>Mis Recetas</NavDropdown.Item>
                                <NavDropdown.Item href="/users">Usuarios</NavDropdown.Item>
                                <NavDropdown.Item href="/userRecipes/">Recetas</NavDropdown.Item>
                                <NavDropdown.Item href="/home">Menú de Recetas</NavDropdown.Item>
                                <NavDropdown.Item href="/mycomment">Comentarios Realizados</NavDropdown.Item>
                            </>
                        ) : (
                            <>
                                <NavDropdown.Item href="/myrecipes">Mis Recetas</NavDropdown.Item>
                                <NavDropdown.Item href="/mycomment">Comentarios Realizados</NavDropdown.Item>
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
