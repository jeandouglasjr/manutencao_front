import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
  InputGroup,
} from "react-bootstrap";
import api from "../services/api"; // O arquivo api.js foi criado em ../services/api

const NovoHistoricoAdocao = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_animal: "",
    id_usuario: "",
    data_adocao: new Date().toISOString().substring(0, 10), // Data atual no formato YYYY-MM-DD
    observacao: "", // Nome do campo no estado: observacao (singular)
  });

  const [animais, setAnimais] = useState([]); // Lista de animais para o Select
  const [adotantes, setAdotantes] = useState([]); // Lista de usuários (adotantes) para o Select

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  // --- Funções Auxiliares de Busca (Para Selects) ---

  const buscarDadosIniciais = async () => {
    try {
      // 1. Buscar Animais
      const animaisResponse = await api.get("/animal");
      const animaisData = animaisResponse.data?.mensagem || [];
      // Filtra apenas animais disponíveis para adoção (se houver o campo)
      setAnimais(
        animaisData
          .filter((a) => a.disponivel !== false) // Filtra se o animal tiver a flag 'disponivel: false'
          .map((a) => ({ id: a.id, nome: a.nome, especie: a.especie }))
      );

      // 2. Buscar Usuários (Adotantes)
      const usuariosResponse = await api.get("/usuario");
      const usuariosData = usuariosResponse.data?.mensagem || [];
      // Mapeia para ID e Nome
      setAdotantes(usuariosData.map((u) => ({ id: u.id, nome: u.nome })));
    } catch (err) {
      console.error("Erro ao buscar dados para os selects", err);
      // Define um erro específico para o formulário
      setStatus((prev) => ({
        ...prev,
        error: "Erro ao carregar animais e/ou adotantes para seleção.",
      }));
    }
  };

  useEffect(() => {
    buscarDadosIniciais();
  }, []);

  // --- Handlers do Formulário ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Handler de Submissão ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    // Validação mínima
    if (!formData.id_animal || !formData.id_usuario) {
      setStatus({
        loading: false,
        error: "Selecione o Animal e o Adotante.",
        success: null,
      });
      return;
    }

    try {
      // Usando formData.observacao (singular), corrigido na iteração anterior.
      const payload = {
        id_animal: parseInt(formData.id_animal), // Garante que seja número
        id_usuario: parseInt(formData.id_usuario), // Garante que seja número
        data_adocao: formData.data_adocao,
        observacao: formData.observacao, // Usa o nome correto do state (singular)
      };

      const response = await api.post("/historico_adocao", payload);
      setStatus({
        loading: false,
        error: null,
        success: "Histórico de adoção registrado com sucesso!",
      });
      console.log("Histórico Criado:", response.data);

      // Redireciona após um pequeno delay
      setTimeout(() => {
        navigate("/historico_adocao");
      }, 1500);
    } catch (error) {
      console.error("Erro ao registrar adoção", error.response || error);
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "Erro ao registrar. Verifique a conexão com a API e os dados.",
        success: null,
      });
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg">
            <Card.Header className="bg-info text-white">
              <h2 className="mb-0">Registrar Nova Adoção 📝</h2>
            </Card.Header>
            <Card.Body>
              {status.error && <Alert variant="danger">{status.error}</Alert>}
              {status.success && (
                <Alert variant="success">{status.success}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  {/* Campo Animal */}
                  <Form.Group as={Col} controlId="formAnimal">
                    <Form.Label>Animal Adotado</Form.Label>
                    <Form.Select
                      name="id_animal"
                      value={formData.id_animal}
                      onChange={handleChange}
                      required
                      disabled={animais.length === 0}
                    >
                      <option value="">Selecione um Animal...</option>
                      {animais.map((animal) => (
                        <option key={animal.id} value={animal.id}>
                          {animal.nome} ({animal.especie})
                        </option>
                      ))}
                    </Form.Select>
                    {animais.length === 0 && (
                      <Form.Text className="text-danger">
                        Nenhum animal disponível ou erro ao carregar.
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* Campo Adotante */}
                  <Form.Group as={Col} controlId="formAdotante">
                    <Form.Label>Adotante (Usuário)</Form.Label>
                    <Form.Select
                      name="id_usuario"
                      value={formData.id_usuario}
                      onChange={handleChange}
                      required
                      disabled={adotantes.length === 0}
                    >
                      <option value="">Selecione o Adotante...</option>
                      {adotantes.map((adotante) => (
                        <option key={adotante.id} value={adotante.id}>
                          {adotante.nome}
                        </option>
                      ))}
                    </Form.Select>
                    {adotantes.length === 0 && (
                      <Form.Text className="text-danger">
                        Nenhum adotante disponível ou erro ao carregar.
                      </Form.Text>
                    )}
                  </Form.Group>
                </Row>

                <Row className="mb-4">
                  {/* Campo Data da Adoção */}
                  <Form.Group as={Col} controlId="formDataAdocao">
                    <Form.Label>Data da Adoção</Form.Label>
                    <Form.Control
                      type="date"
                      name="data_adocao"
                      value={formData.data_adocao}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Row>

                {/* Campo Observação */}
                <Form.Group controlId="formObservacao" className="mb-4">
                  <Form.Label>Observação</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observacao" 
                    value={formData.observacao}
                    onChange={handleChange}
                    placeholder="Detalhes importantes sobre a adoção..."
                  />
                </Form.Group>

                <hr className="my-4" />

                {/* --- Botões de Ação --- */}
                <div className="d-grid gap-2">
                  <Button
                    variant="info"
                    type="submit"
                    disabled={
                      status.loading ||
                      animais.length === 0 ||
                      adotantes.length === 0
                    }
                  >
                    {status.loading
                      ? "Registrando..."
                      : "Registrar Histórico de Adoção"}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    as={Link}
                    to="/historico_adocao"
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

export default NovoHistoricoAdocao;