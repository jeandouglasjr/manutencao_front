import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
  Spinner,
} from "react-bootstrap";
import api from "../services/api";

const EditarAnimal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [animal, setAnimal] = useState({
    nome: "",
    especie: "",
    raca: "",
    sexo: "",
    nascimento: "",
    porte: "",
    saude: "",
    data_resgate: "",
    status: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoadingInitial(true);
        const response = await api.get(`/animal/${id}`);
        console.log("Resposta da API (Animal):", response.data);
        const data = response.data?.mensagem || response.data;
        console.log("Dados processados do animal:", data);

        setAnimal({
          nome: data.nome || "",
          especie: data.especie || "",
          raca: data.raca || "",
          sexo: data.sexo || "",
          nascimento: data.nascimento ? data.nascimento.substring(0, 10) : "",
          porte: data.porte || "",
          saude: data.saude || "",
          data_resgate: data.data_resgate ? data.data_resgate.substring(0, 10) : "",
          status: data.status || "",
        });
      } catch (error) {
        console.error("Erro ao carregar dados do animal", error.response || error);
        setStatus({
          loading: false,
          error: "Erro ao carregar dados do animal. ID inválido ou problema de conexão.",
          success: null,
        });
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchAnimal();
  }, [id]);

  const handleAnimalChange = (e) => {
    setAnimal({ ...animal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    try {
      const response = await api.put(`/animal/${id}`, animal);
      setStatus({
        loading: false,
        error: null,
        success: "Animal atualizado com sucesso!",
      });
      console.log("Animal Atualizado:", response.data);

      setTimeout(() => {
        navigate("/animal");
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar animal", error.response || error);
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "Erro ao atualizar. Verifique a conexão com a API e os dados.",
        success: null,
      });
    }
  };

  if (loadingInitial) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-2">Carregando dados do animal...</p>
      </Container>
    );
  }

  if (status.error && !status.loading && !loadingInitial) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {status.error}
          <div className="mt-2">
            <Button as={Link} to="/animal" variant="danger">
              Voltar para a Lista
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg">
            <Card.Header className="bg-warning text-dark">
              <h2 className="mb-0">Editar Animal: **{animal.nome || "ID " + id}** 📝</h2>
            </Card.Header>
            <Card.Body>
              {status.error && <Alert variant="danger">{status.error}</Alert>}
              {status.success && <Alert variant="success">{status.success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formNome">
                    <Form.Label>Nome</Form.Label>
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
                    <Form.Label>Espécie</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Cachorro, Gato"
                      name="especie"
                      value={animal.especie}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formRaca">
                    <Form.Label>Raça</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Raça"
                      name="raca"
                      value={animal.raca}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formSexo">
                    <Form.Label>Sexo</Form.Label>
                    <Form.Select
                      name="sexo"
                      value={animal.sexo}
                      onChange={handleAnimalChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="M">Macho</option>
                      <option value="F">Fêmea</option>
                      <option value="N">Não Informado</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formNascimento">
                    <Form.Label>Data de Nascimento</Form.Label>
                    <Form.Control
                      type="date"
                      name="nascimento"
                      value={animal.nascimento}
                      onChange={handleAnimalChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formPorte">
                    <Form.Label>Porte</Form.Label>
                    <Form.Select
                      name="porte"
                      value={animal.porte}
                      onChange={handleAnimalChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Pequeno">Pequeno</option>
                      <option value="Medio">Médio</option>
                      <option value="Grande">Grande</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                   <Form.Group as={Col} controlId="formSaude">
                    <Form.Label>Saúde</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Estado de saúde"
                      name="saude"
                      value={animal.saude}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formDataResgate">
                    <Form.Label>Data de Resgate</Form.Label>
                    <Form.Control
                      type="date"
                      name="data_resgate"
                      value={animal.data_resgate}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Disponível, Adotado"
                      name="status"
                      value={animal.status}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                </Row>

                <div className="d-grid gap-2">
                  <Button variant="warning" type="submit" disabled={status.loading}>
                    {status.loading ? "Atualizando..." : "Atualizar Animal"}
                  </Button>
                  <Button variant="outline-secondary" as={Link} to="/animal">
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

export default EditarAnimal;
