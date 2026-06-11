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
      // Assumindo que a resposta de sucesso tem o formato esperado: response.data.mensagem é um array
      const dados = response.data?.historicos || [];

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

  // --- Renderização ---

  return (
    <>
      {/* Navbar Consistente */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/usuario">
            Meu App Pet (Admin)
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/usuario">
                Lista de Usuários
              </Nav.Link>
              <Nav.Link as={Link} to="/animal">
                Lista de Animais
              </Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown
                title={usuarioLogado}
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  <b>SAIR</b>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-5">
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <h1 className="mb-0">📜 Histórico de Adoções</h1>
          </Col>
          <Col md={6} className="text-end">
            <Button variant="success" onClick={handleNovoHistorico}>
              + Nova Adoção (Registro)
            </Button>
          </Col>
        </Row>
        <hr />

        {/* Barra de Busca */}
        <Row className="mb-4">
          <Col md={12}>
            <Form.Group controlId="formBusca">
              <FormControl
                type="text"
                placeholder="Buscar por nome do animal, adotante ou status..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Status de Carregamento/Erro */}
        {loading && <Alert variant="info">Carregando histórico...</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Tabela de Histórico Responsiva */}
        {!loading && !error && (
          <div className="table-responsive shadow-sm">
            {historicosFiltrados.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead className="table-info">
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
                          {/* Renderização condicional para o status */}
                          {col.key === "status" ? (
                            <span
                              className={`badge bg-${
                                hist.status === "Concluída"
                                  ? "primary"
                                  : hist.status === "Pendente"
                                  ? "warning"
                                  : "secondary"
                              }`}
                            >
                              {hist.status || "N/A"}
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
                        <Button variant="danger" size="sm">
                          Excluir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="alert alert-info">
                {busca
                  ? "Nenhum histórico encontrado com a busca."
                  : "Nenhum histórico de adoção cadastrado."}
              </p>
            )}
          </div>
        )}
      </Container>
    </>
  );
};

export default HistoricoAdocao;
