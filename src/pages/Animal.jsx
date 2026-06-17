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
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const calcularIdade = (dataNascimentoString) => {
  if (!dataNascimentoString) return "N/A";

  const dataNascimento = new Date(dataNascimentoString);
  // Verifica se a data é válida
  if (isNaN(dataNascimento.getTime())) return "N/A";

  const dataAtual = new Date();

  let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();

  const mesAtual = dataAtual.getMonth();
  const mesNascimento = dataNascimento.getMonth();

  // Ajuste se o aniversário ainda não ocorreu no ano
  if (
    mesAtual < mesNascimento ||
    (mesAtual === mesNascimento &&
      dataAtual.getDate() < dataNascimento.getDate())
  ) {
    idade--;
  }

  // Retorna a idade como número
  return idade;
};

const Animal = () => {
  const [animais, setAnimais] = useState([]);
  const [busca, setBusca] = useState("");
  // Simulação do nome do usuário logado para a Navbar
  const [usuarioLogado] = useState("Nome do Usuário Logado");
  const navigate = useNavigate();

  // --- Funções de API ---

  const buscarAnimais = async () => {
    try {
      const response = await api.get("/animal");
      const dados = response.data?.mensagem || []; // --- MUDANÇA AQUI ---
      const animaisFormatados = dados.map((animal) => ({
        ...animal,
        id: animal.id, // 1. CALCULA A IDADE e armazena no novo campo 'idade'
        idade: calcularIdade(animal.nascimento), // <-- NOVO CAMPO // 2. Formatação de data (Ainda útil para 'data_cadastro')
        data_cadastro: animal.data_cadastro
          ? new Date(animal.data_cadastro).toLocaleDateString()
          : "N/A", // 3. O campo 'nascimento' não precisa de formatação de data para a tabela, // mas manteremos o valor original (string ISO) para o filtro funcionar corretamente
      }));
      setAnimais(animaisFormatados);
    } catch (error) {
      console.error("Erro ao buscar animais", error);
      alert("Falha ao buscar a lista de animais. Verifique sua autenticação.");
    }
  };

  useEffect(() => {
    buscarAnimais();
    // Você pode buscar o nome real do usuário aqui se necessário
  }, []);

  // --- Lógica de Filtro ---
  // Colunas da tabela
  const colunas = useMemo(
    () => [
      { key: "nome", label: "Nome" },
      { key: "especie", label: "Espécie" },
      { key: "raca", label: "Raça" },
      { key: "idade", label: "Idade" }, // <-- MUDANÇA AQUI: Usa 'idade' (o resultado do cálculo)
      { key: "disponivel", label: "Disponível" },
      { key: "data_cadastro", label: "Criado Em" },
    ],
    []
  );
  // Filtra a lista de animais com base no termo de busca
  const animaisFiltrados = useMemo(() => {
    if (!busca) return animais;

    const termo = busca.toLowerCase();
    return animais.filter((animal) =>
      colunas.some((col) =>
        String(animal[col.key] || "")
          .toLowerCase()
          .includes(termo)
      )
    );
  }, [animais, busca, colunas]);

  // --- Funções de Navegação e Sessão ---

  const handleLogout = () => {
    // Importe e use setAuthToken do seu api.js para remover o token
    // Ex: setAuthToken(null);
    localStorage.removeItem("userToken"); // Simulação direta
    alert("Sessão encerrada!");
    navigate("/login");
  };

  const handleNovoAnimal = () => {
    // Redireciona para a página/formulário de cadastro de novo animal
    navigate("/animal/novo");
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
              <Nav.Link as={Link} to="/historico_adocao">Histórico</Nav.Link>
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
            <h1 className="fw-bold mb-0">Catálogo de Animais</h1>
            <p className="text-muted">Acompanhe e gerencie os pets disponíveis para adoção.</p>
          </Col>
          <Col md={4} className="text-md-end">
            <Button variant="success" onClick={handleNovoAnimal}>
              + Adicionar Animal
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <Form.Group controlId="formBusca">
              <FormControl
                type="text"
                placeholder="Pesquisar por nome, raça ou espécie..."
                value={busca}
                className="py-2"
                onChange={(e) => setBusca(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm overflow-hidden">
          <Card.Body className="p-0">
            <div className="table-responsive">
              {animaisFiltrados.length > 0 ? (
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
                    {animaisFiltrados.map((animal) => (
                      <tr key={animal.id}>
                        {colunas.map((col) => (
                          <td key={col.key}>
                            {col.key === "disponivel" ? (
                              <span className={`badge bg-${animal.disponivel ? "success" : "warning"}`}>
                                {animal.disponivel ? "Sim" : "Não"}
                              </span>
                            ) : (
                              animal[col.key]
                            )}
                          </td>
                        ))}
                        <td className="text-center">
                          <Button
                            variant="warning"
                            size="sm"
                            as={Link}
                            to={`/animal/editar/${animal.id}`}
                            className="me-2"
                          >
                            Editar
                          </Button>
                          <Button variant="info" size="sm" className="me-2 text-white">
                            Detalhes
                          </Button>
                          <Button variant="danger" size="sm">
                            Adotado
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="p-5 text-center text-muted">
                  {busca ? "Nenhum resultado encontrado." : "Nenhum animal cadastrado."}
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Animal;
