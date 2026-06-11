import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import api from "../services/api";

const NovoAnimal = () => {
  const navigate = useNavigate();
  const [animal, setAnimal] = useState({
    nome: "",
    especie: "",
    raca: "",
    sexo: "",
    nascimento: "",
    porte: "",
    saude: "",
    data_resgate: "",
  });

  // Estado para gerenciar o status da requisição (carregamento, erro, sucesso)
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  // --- Handlers do Formulário Principal (Animal) ---
  const handleAnimalChange = (e) => {
    setAnimal({ ...animal, [e.target.name]: e.target.value });
  };

  // --- Handler de Submissão ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    // Monta o payload conforme a estrutura esperada pelo back-end
    const payload = {
      ...animal,
    };

    try {
      // Endpoint de cadastro. Usando o 'api.post' (agora o mock)
      const response = await api.post("/animal", payload);
      setStatus({
        loading: false,
        error: null,
        success: response.data.mensagem || "Animal cadastrado com sucesso!",
      });
      console.log("Animal Cadastrado:", response.data);

      setTimeout(() => {
        // Redireciona após o sucesso do cadastro
        navigate("/animal");
      }, 1500);
    } catch (error) {
      console.error("Erro ao cadastrar animal", error.response || error);
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "Erro ao cadastrar. Verifique a conexão com a API e os dados.",
        success: null,
      });
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">Cadastrar Novo Animal 🐾</h2>
            </Card.Header>
            <Card.Body>
              {status.error && <Alert variant="danger">{status.error}</Alert>}
              {status.success && (
                <Alert variant="success">{status.success}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <h3>Dados</h3>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formNome">
                    <Form.Control
                      type="text"
                      placeholder="Nome do Animal"
                      name="nome"
                      value={animal.nome}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formEspecie">
                    <Form.Control
                      type="text"
                      placeholder="Espécie (ex: Cachorro, Gato)"
                      name="especie"
                      value={animal.especie}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formRaca">
                    <Form.Control
                      type="text"
                      placeholder="Raça"
                      name="raca"
                      value={animal.raca}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} controlId="formSexo">
                    <Form.Control
                      as="select"
                      name="sexo"
                      value={animal.sexo}
                      onChange={handleAnimalChange}
                      required
                    >
                      <option value="">Sexo (Selecione)</option>
                      <option value="M">Macho</option>
                      <option value="F">Fêmea</option>
                      <option value="N">Não Informado</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formNascimento">
                    <Form.Control
                      type="date"
                      name="nascimento"
                      // Adicionando um placeholder para contexto, embora não seja bem suportado pelo tipo date
                      placeholder="Data de Nascimento"
                      value={animal.nascimento}
                      onChange={handleAnimalChange}
                      // Removido 'required' para permitir cadastro sem data de nascimento exata
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formPorte">
                    <Form.Control
                      as="select"
                      name="porte"
                      value={animal.porte}
                      onChange={handleAnimalChange}
                      required
                    >
                      <option value="">Porte (Selecione)</option>
                      <option value="Pequeno">Pequeno</option>
                      <option value="Medio">Médio</option>
                      <option value="Grande">Grande</option>
                    </Form.Control>
                  </Form.Group>
                </Row>

                <Row className="mb-4">
                  <Form.Group as={Col} controlId="formSaude">
                    <Form.Control
                      type="text"
                      placeholder="Estado de Saúde (Ex: Vacinado, Castrado)"
                      name="saude"
                      value={animal.saude}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formDataResgate">
                    <Form.Control
                      type="date"
                      placeholder="Data do resgate"
                      name="data_resgate"
                      value={animal.data_resgate}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formStatus">
                    <Form.Control
                      type="text"
                      placeholder="Status"
                      name="status"
                      value={animal.status}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                </Row>

                <hr className="my-4" />

                <div className="d-grid gap-2">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={status.loading}
                  >
                    {status.loading ? "Cadastrando..." : "Cadastrar Animal"}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    as={Link}
                    to="/animal" // Volta para a lista de animais
                    disabled={status.loading}
                  >
                    Voltar para a Lista
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NovoAnimal;
