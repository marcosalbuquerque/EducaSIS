import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
    return (
        <Container
            fluid
            className="d-flex align-items-center justify-content-center"
            style={{ height: "100vh", background: "#f5f5f5" }}
        >
            <Card style={{ width: "400px" }} className="p-4 shadow-lg">
                <h1 className="mb-4 text-center text-primary">EducaSIS</h1>
                <h4 className="mb-4 text-center">Selecione o seu perfil</h4>

                <div className="d-flex gap-2">
                    <Link to="/login/aluno" className="flex-fill">
                        <Button variant="outline-primary" size="lg" block className="outline-hover w-100">
                            Aluno
                        </Button>
                    </Link>

                    <Link to="/login/professor" className="flex-fill">
                        <Button variant="outline-primary" size="lg" block className="outline-hover w-100">
                            Professor
                        </Button>
                    </Link>

                    <Link to="/login/admin" className="flex-fill">
                        <Button variant="outline-danger" size="lg" block className="outline-hover w-100">
                            Admin
                        </Button>
                    </Link>
                </div>
            </Card>
        </Container>
    )
}

export default Home;
