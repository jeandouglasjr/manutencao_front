import React, { useEffect, useState, useMemo } from "react";
// import api from "../services/api"; // Esta linha foi removida pois causava erro de compilação
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Navbar,
  Nav,
  NavDropdown,
  Row,
  Col,
  Card,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css"; // Importe o CSS do Bootstrap
import api from "../services/api";

// Ícone simples para mostrar/esconder senha. Use um ícone real se tiver uma biblioteca (ex: react-icons)
const EyeIcon = ({ onClick, isVisible }) => (
  <span
    onClick={onClick}
    style={{
      cursor: "pointer",
      marginLeft: "5px",
      color: isVisible ? "#dc3545" : "#28a745", // Corrigindo cores para bootstrap (red/green)
    }}
    title={isVisible ? "Esconder Senha" : "Mostrar Senha"}
  >
    {isVisible ? "🙈" : "👀"}
  </span>
);

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [senhaVisivelMap, setSenhaVisivelMap] = useState({}); // Mapeia o ID do usuário para o estado da senha
  const [usuarioLogado] = useState(
    // NOTE: O uso de localStorage não é ideal em React, mas mantido para replicar o código original.
    localStorage.getItem("userName") || "Usuário Admin"
  );

  const navigate = useNavigate();

  const buscarUsuarios = async () => {
    try {
      // Rota de busca no seu back-end Supabase (agora simulada pelo mock 'api')
      const response = await api.get("/usuario");

      // Assumindo que a resposta de sucesso tem o formato esperado: response.data.mensagem é um array de usuários
      const dados = response.data?.mensagem || [];

      // Mapeia os dados para garantir que campos de data sejam formatados se vierem como string ISO
      const usuariosFormatados = dados.map((usuario) => ({
        ...usuario,
        // Garante que o ID do usuário seja uma string/número válida para usar na chave e no mapa de senhas
        id: usuario.id || usuario.email,
        data_cadastro: usuario.data_cadastro
          ? new Date(usuario.data_cadastro).toLocaleString("pt-BR")
          : "N/A",
        updatedAt: usuario.updatedAt
          ? new Date(usuario.updatedAt).toLocaleString("pt-BR")
          : "N/A",
      }));
      setUsuarios(usuariosFormatados);
    } catch (error) {
      console.error("Erro ao buscar usuário", error);
      setUsuarios([]);
    }
  };

  const excluirUsuario = async (id) => {
    try{
      console.log('excluindo', id)
      const respostaConfirm = confirm("Confirma a exclusão do usuário?")
      console.log('respostaConfirm', respostaConfirm)
      if (respostaConfirm) {
        await api.delete(`/usuario/${id}`);
        alert(`Usuário excluído com sucesso.`)
        buscarUsuarios();
      }
    }
    catch {
      alert(`Usuário não pôde ser excluído (provávelmente já adotou)`)
    }
  }

  useEffect(() => {
    // Busca os usuários ao carregar o componente
    buscarUsuarios();
  }, []);

  const toggleSenhaVisivel = (userId) => {
    setSenhaVisivelMap((prevMap) => ({
      ...prevMap,
      [userId]: !prevMap[userId],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName"); // Limpa o nome também
    console.log("Usuário deslogado");
    navigate("/login"); // Usa o hook navigate
  };

  // Memoiza as colunas da tabela para fácil referência e estilização
  const colunas = useMemo(
    () => [
      { key: "nome", label: "Nome" },
      { key: "cpf", label: "CPF" },
      { key: "email", label: "Email" },
      { key: "senha", label: "Senha", isPassword: true },
      { key: "data_cadastro", label: "Data de Cadastro" },
      { key: "updatedAt", label: "Última Atualização" },
    ],
    []
  );

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
              <Nav.Link as={Link} to="/animal" className="active">Animais</Nav.Link>
              <Nav.Link as={Link} to="/historico_adocao">Histórico</Nav.Link>
              <Nav.Link as={Link} to="/usuario/novo">Novo Usuário</Nav.Link>
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
            <h1 className="fw-bold mb-0">Lista de Usuários</h1>
            <p className="text-muted">Gerencie os acessos e permissões do sistema.</p>
          </Col>
          <Col md={4} className="text-md-end">
            <Button variant="success" as={Link} to="/usuario/novo">
              + Novo Usuário
            </Button>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm overflow-hidden">
          <Card.Body className="p-0">
            <div className="table-responsive">
              {usuarios.length > 0 ? (
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
                    {usuarios.map((usuario, index) => (
                      <tr key={usuario.id || index}>
                        {colunas.map((col) => (
                          <td key={col.key}>
                            {col.isPassword ? (
                              <div className="d-flex align-items-center">
                                <span className="me-2">
                                  {senhaVisivelMap[usuario.id] ? usuario.senha : "••••••••"}
                                </span>
                                <EyeIcon
                                  onClick={() => toggleSenhaVisivel(usuario.id)}
                                  isVisible={senhaVisivelMap[usuario.id]}
                                />
                              </div>
                            ) : (
                              usuario[col.key]
                            )}
                          </td>
                        ))}
                        <td className="text-center">
                          <Button
                            variant="warning"
                            size="sm"
                            as={Link}
                            to={`/usuario/editar/${usuario.id}`}
                            className="me-2"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => excluirUsuario(usuario.id)}
                          >
                            Excluir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="p-5 text-center">
                  <p className="alert alert-info border-0 mb-0">
                    Nenhum usuário encontrado ou erro ao conectar com a API.
                  </p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        <div className="mt-4">
          <Button variant="outline-primary" onClick={buscarUsuarios} size="sm">
            🔄 Atualizar Lista
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Usuario;
