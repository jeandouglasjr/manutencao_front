// src/pages/Login.jsx
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
  // Recebe um prop para atualizar o estado de login
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState({ loading: false, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      const response = await api.post("/login", { email, senha });

      // 💡 PONTO DE ATENÇÃO: Verifique se o Back-end retorna { token, usuario: { nome, ... } }
      const { token, usuario } = response.data; // 1. Armazena o token (CORRETO)

      localStorage.setItem("userToken", token);

      // 2. Armazena o nome do usuário para exibição na interface (ADICIONADO)
      if (usuario && usuario.nome) {
        localStorage.setItem("userName", usuario.nome);
      } else {
        // Fallback caso o nome não venha na resposta
        localStorage.setItem("userName", "Usuário");
      }

      setStatus({ loading: false, error: null }); // 3. Redireciona para a página principal ou lista de usuários

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
    <Container className="my-5">
      {" "}
      <Row className="justify-content-md-center">
        {" "}
        <Col md={6} lg={4}>
          {" "}
          <Card className="shadow-lg">
            {" "}
            <Card.Header className="bg-primary text-white text-center">
              <h2 className="mb-0">Acesso ao Sistema 🐾</h2>{" "}
            </Card.Header>{" "}
            <Card.Body>
              {" "}
              {status.error && (
                <Alert variant="danger">{status.error}</Alert>
              )}{" "}
              <Form onSubmit={handleSubmit}>
                {" "}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>{" "}
                  <Form.Control
                    type="email"
                    placeholder="Seu email cadastrado"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />{" "}
                </Form.Group>{" "}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>{" "}
                  <Form.Control
                    type="password"
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />{" "}
                </Form.Group>{" "}
                <div className="d-grid gap-2">
                  {" "}
                  <Button
                    variant="success"
                    type="submit"
                    disabled={status.loading}
                  >
                    {" "}
                    {status.loading ? "Entrando..." : "Entrar"}{" "}
                  </Button>{" "}
                </div>{" "}
              </Form>{" "}
            </Card.Body>{" "}
            <Card.Footer className="text-center">
              Não tem uma conta? <Link to="/usuario/novo">Cadastre-se</Link>{" "}
            </Card.Footer>{" "}
          </Card>{" "}
        </Col>{" "}
      </Row>{" "}
    </Container>
  );
};

export default Login;
