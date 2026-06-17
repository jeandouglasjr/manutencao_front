import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState({ loading: false, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      const response = await api.post("/login", { email, senha });
      const { token, usuario } = response.data;
      localStorage.setItem("userToken", token);
      if (usuario && usuario.nome) {
        localStorage.setItem("userName", usuario.nome);
      } else {
        localStorage.setItem("userName", "Usuário");
      }
      setStatus({ loading: false, error: null });
      navigate("/usuario");
    } catch (error) {
      console.error("Erro no Login:", error.response || error);
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "Erro ao fazer login. Verifique suas credenciais.",
      });
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center",
      background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.2), transparent), radial-gradient(circle at bottom left, rgba(244, 63, 94, 0.2), transparent)"
    }}>
      <Container className="animate-fade-in">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="border-0 shadow-lg p-3">
              <Card.Header className="bg-transparent border-0 text-center pb-0">
                <h2 className="fw-bold mb-0">Bem-vindo</h2>
                <p className="text-muted small">Entre na sua conta para continuar</p>
              </Card.Header>
              <Card.Body>
                {status.error && <Alert variant="danger" className="py-2 small">{status.error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" disabled={status.loading}>
                      {status.loading ? "Autenticando..." : "Entrar"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0 text-center pt-0 pb-4">
                <span className="text-muted small">Não tem uma conta? </span>
                <Link to="/usuario/novo" className="small text-primary text-decoration-none fw-bold">Cadastre-se</Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
