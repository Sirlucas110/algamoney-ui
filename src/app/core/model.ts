export class Endereco {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string
}

export class Contato{
  codigo?: number;
  nome?: string;
  email?: string;
  telefone?: string;

  constructor(
    codigo?: number,
    nome?: string,
    email?: string,
    telefone?: string){
      this.codigo = codigo;
      this.nome = nome;
      this.email = email;
      this.telefone = telefone;
  }
}

export class Pessoa {
  codigo?: number;
  nome?: string;
  ativo = true;
  endereco = new Endereco;
  contatos = new Array<Contato>();
  
}

export class Categoria {
  codigo?: number;
}

export class Lancamento {
  codigo?: number;
  tipo: string = 'RECEITA';
  descricao?: string;
  dataVencimento?: Date;
  dataPagamento?: Date;
  valor?: number;
  observacao?: string;
  pessoa = new Pessoa();
  categoria: Categoria = new Categoria()
  anexo?: string;
  urlAnexo?: string;
}
