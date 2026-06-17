// src/pages/HistoricoAdocao.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const HistoricoAdocao = () => {
  const [historicos, setHistoricos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioLogado] = useState(
    // Replicando a lógica de Usuario.jsx
    localStorage.getItem("userName") || "Usuário Admin"
  );
  const navigate = useNavigate();

  // --- Funções de API ---

  const buscarHistoricos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Rota simulada: /historico_adocao
      const response = await api.get("/historico_adocao");
      // Assumindo que a resposta de sucesso tem o formato esperado
      const dados = response.data?.historicos || response.data?.mensagem || response.data || [];

      // Mapeia os dados, formata datas e garante IDs
      const historicosFormatados = dados.map((hist) => ({
        ...hist,
        id: hist.id || hist.animal_id + "-" + hist.adotante_id, // ID composto/simulado se o BD não fornecer
        data_adocao: hist.data_adocao
          ? new Date(hist.data_adocao).toLocaleDateString("pt-BR")
          : "N/A",
        // Campos que o back-end deve fornecer: animal_nome, adotante_nome
        animal_nome: hist.animal_adotado?.nome || "Animal Desconhecido",
        adotante_nome: hist.adotante?.nome || "Adotante Desconhecido",
      }));

      setHistoricos(historicosFormatados);
    } catch (err) {
      console.error("Erro ao buscar histórico de adoção", err);
      setError("Falha ao buscar o histórico. Verifique a conexão com a API.");
      setHistoricos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarHistoricos();
  }, []);

  // --- Lógica de Filtro ---

  const colunas = useMemo(
    () => [
      // Colunas para exibir (ajuste conforme os campos reais do seu modelo)
      { key: "animal_nome", label: "Animal" },
      { key: "adotante_nome", label: "Adotante" },
      { key: "data_adocao", label: "Data Adoção" },
      { key: "observacao", label: "Observação" },
    ],
    []
  );

  const historicosFiltrados = useMemo(() => {
    if (!busca) return historicos;

    const termo = busca.toLowerCase();
    return historicos.filter((hist) =>
      colunas.some((col) =>
        String(hist[col.key] || "")
          .toLowerCase()
          .includes(termo)
      )
    );
  }, [historicos, busca, colunas]);

  // --- Funções de Navegação e Sessão ---

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    console.log("Usuário deslogado");
    navigate("/login");
  };

  const handleNovoHistorico = () => {
    navigate("/historico_adocao/novo");
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Deseja realmente excluir este histórico de adoção?")) {
      try {
        await api.delete(`/historico_adocao/${id}`);
        alert("Histórico excluído com sucesso!");
        // Recarregar a lista
        const response = await api.get("/historico_adocao");
        setHistoricos(response.data?.mensagem || response.data?.historicos || response.data || []);
      } catch (error) {
        console.error("Erro ao excluir histórico", error);
        alert(error.response?.data?.mensagem || "Erro ao excluir histórico.");
      }
    }
  };

  // --- Renderização ---

  return (
    <>
      <Navbar expand="lg" className="sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Pet System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/usuario">Usuários</Nav.Link>
              <Nav.Link as={Link} to="/animal">Animais</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title={usuarioLogado} id="user-nav-dropdown" align="end">
                <NavDropdown.Item onClick={handleLogout} className="text-danger fw-bold">
                  Sair
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-5 animate-fade-in">
        <Row className="mb-4 align-items-center">
          <Col md={8}>
            <h1 className="fw-bold mb-0">Histórico de Adoções</h1>
            <p className="text-muted">Registro detalhado de todos os processos de adoção concluídos.</p>
          </Col>
          <Col md={4} className="text-md-end">
            <Button variant="success" onClick={handleNovoHistorico}>
              + Nova Adoção
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <Form.Group controlId="formBusca">
              <FormControl
                type="text"
                placeholder="Pesquisar por animal, adotante ou observação..."
                value={busca}
                className="py-2"
                onChange={(e) => setBusca(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {loading && <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>}
        {error && <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>}

        {!loading && !error && (
          <Card className="border-0 shadow-sm overflow-hidden">
            <Card.Body className="p-0">
              <div className="table-responsive">
                {historicosFiltrados.length > 0 ? (
                  <Table hover responsive className="mb-0">
                    <thead>
                      <tr>
                        {colunas.map((col) => (
                          <th key={col.key}>{col.label}</th>
                        ))}
                        <th className="text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicosFiltrados.map((hist) => (
                        <tr key={hist.id}>
                          {colunas.map((col) => (
                            <td key={col.key}>
                              {col.key === "status" ? (
                                <span
                                  className={`badge bg-${
                                    hist.status === "Concluída"
                                      ? "success"
                                      : hist.status === "Pendente"
                                      ? "warning"
                                      : "primary"
                                  }`}
                                >
                                  {hist.status || "Ativa"}
                                </span>
                              ) : (
                                hist[col.key]
                              )}
                            </td>
                          ))}
                          <td className="text-center">
                            <Button
                              variant="warning"
                              size="sm"
                              as={Link}
                              to={`/historico_adocao/editar/${hist.id}`}
                              className="me-2"
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleExcluir(hist.id)}
                            >
                              Excluir
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="p-5 text-center text-muted">
                    {busca ? "Nenhum resultado encontrado." : "Nenhum histórico registrado."}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default HistoricoAdocao;
