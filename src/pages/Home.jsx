import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Home = () => {
  return (
    <Container className="my-5 animate-fade-in">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3 text-primary">
          Pet Adoption System
        </h1>
        <p className="lead text-muted">
          Gerenciamento inteligente para o bem-estar animal.
        </p>
      </div>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 p-4 text-center">
            <Card.Title className="fs-3 mb-3">Animais</Card.Title>
            <Card.Text className="text-muted mb-4">
              Gerencie o catálogo de animais disponíveis para adoção.
            </Card.Text>
            <Button as={Link} to="/animal" variant="primary" className="mt-auto">
              Ver Animais
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 p-4 text-center">
            <Card.Title className="fs-3 mb-3">Histórico</Card.Title>
            <Card.Text className="text-muted mb-4">
              Acompanhe todas as adoções realizadas no sistema.
            </Card.Text>
            <Button as={Link} to="/historico_adocao" variant="primary" className="mt-auto">
              Ver Histórico
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 p-4 text-center">
            <Card.Title className="fs-3 mb-3">Usuários</Card.Title>
            <Card.Text className="text-muted mb-4">
              Gerencie usuários, adotantes e administradores.
            </Card.Text>
            <Button as={Link} to="/usuario" variant="primary" className="mt-auto">
              Gerenciar Usuários
            </Button>
          </Card>
        </Col>
      </Row>

      <footer className="mt-5 text-center text-muted">
        <p className="small">© 2026 Pet Adoption System - Todos os direitos reservados.</p>
      </footer>
    </Container>
  );
};

export default Home;
