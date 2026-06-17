// src/pages/EditarUsuario.jsx
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

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingInitial, setLoadingInitial] = useState(true);

  // 2. Estados Principais (Usuário, Endereços)
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    fone: "",
  });

  const [enderecos, setEnderecos] = useState([
    {
      logradouro: "",
      numero: "",
      complemento: "",
      municipio: "",
      uf: "",
      cep: "",
      bairro: "",
    },
  ]);

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  // 3. Efeito para carregar os dados do usuário
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoadingInitial(true);
        const response = await api.get(`/usuario/${id}`);
        console.log("Resposta da API (Usuário):", response.data);
        
        // Carregamento Inteligente: Tenta várias chaves possíveis do backend
        const receivedData = response.data?.mensagem || response.data?.usuario || response.data;
        const data = Array.isArray(receivedData) ? receivedData[0] : receivedData;
        
        console.log("Dados processados do usuário:", data);

        // Atualiza o estado principal do usuário
        setUsuario({
          nome: data.nome || "",
          email: data.email || "",
          cpf: data.cpf || "",
          fone: data.fone || "",
          senha: "", // Não preencher o campo de senha
        });

        // Mapeia e atualiza Endereços
        if (data.enderecos && data.enderecos.length > 0) {
          setEnderecos(
            data.enderecos.map((end) => ({
              logradouro: end.logradouro || "",
              numero: end.numero || "",
              complemento: end.complemento || "",
              municipio: end.municipio || "",
              uf: end.uf || "",
              cep: end.cep || "",
              bairro: end.bairro || "",
            }))
          );
        } else {
          setEnderecos([
            {
              logradouro: "",
              numero: "",
              complemento: "",
              municipio: "",
              uf: "",
              cep: "",
              bairro: "",
            },
          ]);
        }

      } catch (error) {
        console.error("Erro ao carregar dados do usuário", error.response || error);
        setStatus({
          loading: false,
          error:
            "Erro ao carregar dados do usuário. ID inválido ou problema de conexão.",
          success: null,
        });
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchUsuario();
  }, [id]);

  // --- Handlers do Formulário Principal (Usuário) ---
  const handleUsuarioChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  // --- Handlers para Endereços ---
  const handleEnderecoChange = (index, e) => {
    const novosEnderecos = enderecos.map((endereco, i) => {
      if (i === index) {
        return { ...endereco, [e.target.name]: e.target.value };
      }
      return endereco;
    });
    setEnderecos(novosEnderecos);
  };

  const addEndereco = () => {
    setEnderecos([
      ...enderecos,
      {
        logradouro: "",
        numero: "",
        complemento: "",
        municipio: "",
        uf: "",
        cep: "",
        bairro: "",
      },
    ]);
  };

  const removeEndereco = (index) => {
    const novosEnderecos = enderecos.filter((_, i) => i !== index);
    setEnderecos(novosEnderecos);
  };

  // --- Handler de Submissão ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    // Monta o payload (mesma lógica de filtro do NovoUsuario.jsx)
    const payload = {
      ...usuario,
      enderecos: enderecos.filter(
        (addr) => addr.logradouro && addr.municipio && addr.uf && addr.bairro
      ),
    };

    // Nova Validação Front-end: Garante que haja pelo menos 1 endereço completo
    if (payload.enderecos.length === 0) {
      setStatus({
        loading: false,
        error:
          "Pelo menos um endereço completo (Logradouro, Bairro, Município, UF) é obrigatório.",
        success: null,
      });
      return;
    }

    // Validação da Senha
    if (usuario.senha === "") {
        // Remove a propriedade senha do payload se estiver vazia (para não sobrescrever no backend)
        delete payload.senha; 
    }
    
    try {
      // 4. Usa api.put para o endpoint de edição
      const response = await api.put(`/usuario/${id}`, payload);
      setStatus({
        loading: false,
        error: null,
        success: "Usuário atualizado com sucesso!",
      });
      console.log("Usuário Atualizado:", response.data);

      setTimeout(() => {
        navigate("/usuario"); // Volta para a lista após o sucesso
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar usuário", error.response || error);
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "Erro ao atualizar. Verifique a conexão com a API e os dados.",
        success: null,
      });
    }
  };

  // Mostra um spinner enquanto carrega os dados iniciais
  if (loadingInitial) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-2">Carregando dados do usuário...</p>
      </Container>
    );
  }

  // Se o carregamento inicial falhou e há um erro
  if (status.error && !status.loading && !loadingInitial) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {status.error}
          <div className="mt-2">
            <Button as={Link} to="/usuario" variant="danger">
              Voltar para a Lista
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Formulário Principal
  return (
    <Container className="my-5 animate-fade-in">
      <Row className="justify-content-md-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg p-3">
            <Card.Header className="bg-transparent border-0 pb-0">
              <h2 className="fw-bold mb-0">
                Editar Usuário: <span className="text-primary">{usuario.nome || "ID " + id}</span> 📝
              </h2>
              <p className="text-muted small">Atualize as informações cadastrais e endereços do usuário.</p>
            </Card.Header>
            <Card.Body>
              {status.error && <Alert variant="danger" className="py-2 small">{status.error}</Alert>}
              {status.success && (
                <Alert variant="success" className="py-2 small">{status.success}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* --- Seção 1: Dados Pessoais --- */}
                <h5 className="fw-bold mb-3 border-bottom pb-2">Dados Pessoais</h5>
                <Row className="mb-3">
                  <Form.Group as={Col} md={7} controlId="formNome">
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nome Completo"
                      name="nome"
                      value={usuario.nome}
                      onChange={handleUsuarioChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={5} controlId="formCPF">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="CPF"
                      name="cpf"
                      value={usuario.cpf}
                      onChange={handleUsuarioChange}
                      required
                      disabled
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} md={6} controlId="formFone">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="(48) 90000-0000"
                      name="fone"
                      value={usuario.fone}
                      onChange={handleUsuarioChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6} controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="email@exemplo.com"
                      name="email"
                      value={usuario.email}
                      onChange={handleUsuarioChange}
                      required
                    />
                  </Form.Group>
                </Row>
                
                <Form.Group className="mb-4" controlId="formSenha">
                  <Form.Label>Nova Senha (deixe em branco para manter a atual)</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    name="senha"
                    value={usuario.senha}
                    onChange={handleUsuarioChange}
                  />
                </Form.Group>

                {/* --- Seção 2: Endereços --- */}
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                  <h5 className="fw-bold mb-0">Endereços ({enderecos.length})</h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={addEndereco}
                  >
                    + Adicionar
                  </Button>
                </div>

                {enderecos.map((endereco, index) => (
                  <Card key={index} className="mb-3 border-dashed bg-transparent p-3">
                    <Row className="g-2">
                      <Col md={8}>
                        <Form.Label className="small mb-1">Rua / Logradouro</Form.Label>
                        <Form.Control
                          type="text"
                          name="logradouro"
                          value={endereco.logradouro}
                          onChange={(e) => handleEnderecoChange(index, e)}
                          required
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Label className="small mb-1">Número</Form.Label>
                        <Form.Control
                          type="text"
                          name="numero"
                          value={endereco.numero}
                          onChange={(e) => handleEnderecoChange(index, e)}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="small mb-1">Bairro</Form.Label>
                        <Form.Control
                          type="text"
                          name="bairro"
                          value={endereco.bairro}
                          onChange={(e) => handleEnderecoChange(index, e)}
                          required
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="small mb-1">Município</Form.Label>
                        <Form.Control
                          type="text"
                          name="municipio"
                          value={endereco.municipio}
                          onChange={(e) => handleEnderecoChange(index, e)}
                          required
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Label className="small mb-1">UF</Form.Label>
                        <Form.Control
                          type="text"
                          name="uf"
                          maxLength={2}
                          value={endereco.uf}
                          onChange={(e) => handleEnderecoChange(index, e)}
                          required
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="small mb-1">CEP</Form.Label>
                        <Form.Control
                          type="text"
                          name="cep"
                          value={endereco.cep}
                          onChange={(e) => handleEnderecoChange(index, e)}
                        />
                      </Col>
                      <Col md={2} className="d-flex align-items-end justify-content-end">
                        {enderecos.length > 1 && (
                          <Button
                            variant="outline-danger"
                            onClick={() => removeEndereco(index)}
                            size="sm"
                            title="Remover endereço"
                          >
                            🗑️
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))}

                <div className="d-grid gap-2 mt-5">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={status.loading}
                    className="py-2"
                  >
                    {status.loading ? "Atualizando..." : "Salvar Alterações"}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    as={Link}
                    to="/usuario"
                    disabled={status.loading}
                  >
                    Cancelar
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

export default EditarUsuario;