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

const EditarHistoricoAdocao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [animais, setAnimais] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [historico, setHistorico] = useState({
    id_animal: "",
    id_usuario: "",
    data_adocao: "",
    observacao: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingInitial(true);
        // 1. Carregar lista de animais e usuários para os selects
        const [resAnimais, resUsuarios, resHistorico] = await Promise.all([
          api.get("/animal"),
          api.get("/usuario"),
          api.get(`/historico_adocao/${id}`),
        ]);

        setAnimais(resAnimais.data?.mensagem || resAnimais.data?.animais || []);
        setUsuarios(resUsuarios.data?.mensagem || resUsuarios.data?.usuarios || []);

        console.log("Resposta da API (Histórico Raw):", resHistorico.data);
        
        // Carregamento Inteligente
        const receivedData = resHistorico.data?.mensagem || resHistorico.data?.historico || resHistorico.data;
        const data = Array.isArray(receivedData) ? receivedData[0] : receivedData;
        
        console.log("Dados processados do histórico:", data);

        setHistorico({
          id_animal: data.id_animal || "",
          id_usuario: data.id_usuario || "",
          data_adocao: data.data_adocao ? data.data_adocao.substring(0, 10) : "",
          observacao: data.observacao || "",
        });
      } catch (error) {
        console.error("Erro ao carregar dados", error.response || error);
        setStatus({
          loading: false,
          error: "Erro ao carregar dados. Verifique a conexão com a API.",
          success: null,
        });
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setHistorico({ ...historico, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    try {
      const response = await api.put(`/historico_adocao/${id}`, historico);
      setStatus({
        loading: false,
        error: null,
        success: "Histórico de adoção atualizado com sucesso!",
      });

      setTimeout(() => {
        navigate("/historico_adocao");
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar histórico", error.response || error);
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "Erro ao atualizar. Verifique a conexão com a API.",
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
        <p className="mt-2">Carregando dados...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg">
            <Card.Header className="bg-warning text-dark">
              <h2 className="mb-0">Editar Histórico de Adoção 📝</h2>
            </Card.Header>
            <Card.Body>
              {status.error && <Alert variant="danger">{status.error}</Alert>}
              {status.success && <Alert variant="success">{status.success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formAnimal">
                    <Form.Label>Animal</Form.Label>
                    <Form.Select
                      name="id_animal"
                      value={historico.id_animal}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um animal</option>
                      {animais.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nome} ({a.especie})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formUsuario">
                    <Form.Label>Adotante</Form.Label>
                    <Form.Select
                      name="id_usuario"
                      value={historico.id_usuario}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um adotante</option>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formDataAdocao">
                    <Form.Label>Data de Adoção</Form.Label>
                    <Form.Control
                      type="date"
                      name="data_adocao"
                      value={historico.data_adocao}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-4" controlId="formObservacao">
                  <Form.Label>Observação</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observacao"
                    value={historico.observacao}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="warning" type="submit" disabled={status.loading}>
                    {status.loading ? "Atualizando..." : "Atualizar Histórico"}
                  </Button>
                  <Button variant="outline-secondary" as={Link} to="/historico_adocao">
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

export default EditarHistoricoAdocao;
