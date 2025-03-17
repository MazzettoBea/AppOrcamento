class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}

class Bd {
    constructor() {
        if (typeof(Storage) !== "undefined") {
            let id = localStorage.getItem('id');
            if (id === null) {
                localStorage.setItem('id', '0'); // Armazena como string
            }
        } else {
            console.error("localStorage não suportado!");
        }
    }

    getProximoId() {
        if (typeof(Storage) !== "undefined") {
            let proximoId = localStorage.getItem('id');
            console.log("Valor do proximoId antes da conversão:", proximoId);
            let parsedId = parseInt(proximoId, 10);
            console.log("Valor do parsedId depois da conversão:", parsedId);
            if (isNaN(parsedId)) {
                console.error("Erro: proximoId é NaN. Retornando 1.");
                return 1;
            }
            return parsedId + 1;
        } else {
            console.error("localStorage não suportado!");
            return 1;
        }
    }

    gravar(d) {
        let id = this.getProximoId();
        console.log("Salvando a despesa com o ID:", id, d);
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(id, JSON.stringify(d));
            localStorage.setItem('id', String(id)); // Armazena como string
        } else {
            console.error("localStorage não suportado!");
        }
    }

    recuperarTodosRegistros() {
        let despesas = Array();
        let id = localStorage.getItem('id')

        for(let i = 1; i<= id; i++){
            //recuperar despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //pular indices removidos ou pulados
            if(despesa === null){
                continue
            }
            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;
    }
    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        //ano
        if(despesa.ano != ''){
          despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
          }
        //dia
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
          }
        //tipo
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
          }
        //decricao
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
          }
        //valor
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
          }
          return despesasFiltradas
    }
    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd();

function cadastrarDespesa() {
    
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    // criar o objeto despesa
    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);

    // validar o objeto despesa
    if (despesa.validarDados()) {
        bd.gravar(despesa);

        // sucesso
        document.getElementById('modal_titulo').innerHTML = "Registro inserido com sucesso!";
        document.getElementById('modal_titulo_div').className = 'modal-header text-success';
        document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso';
        document.getElementById('modal_btn').innerHTML = 'Voltar';
        document.getElementById('modal_btn').className = 'btn btn-success';

        $('#modalRegistraDespesa').modal('show');
    } else {
        // erro
        document.getElementById('modal_titulo').innerHTML = "Erro ao registrar!";
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
        document.getElementById('modal_conteudo').innerHTML = 'Por favor, preencha todos os campos corretamente.';
        document.getElementById('modal_btn').innerHTML = 'Ok';
        document.getElementById('modal_btn').className = 'btn btn-danger';

        $('#modalRegistraDespesa').modal('show');
    }
    // limpar form
    ano.value = '';
    mes.value = '';
    dia.value = '';
    tipo.value = '';
    descricao.value = '';
    valor.value = '';
    // fechar modal onclick
    document.getElementById('modal_btn').onclick = function() {
        $('#modalRegistraDespesa').modal('hide');
    };
}

function carregarListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros();
    }

    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    despesas.forEach(function(d) {
        let linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'; break;
            case '2': d.tipo = 'Educação'; break;
            case '3': d.tipo = 'Lazer'; break;
            case '4': d.tipo = 'Saúde'; break;
            case '5': d.tipo = 'Transporte'; break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        // Botão 
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_despesa_${d.id}`;

        // Ao clicar no botão, abrir o modal 
        btn.onclick = function() { 
            idParaExcluir = this.id.replace('id_despesa_', ''); 
            $('#modalConfirmacao').modal('show'); 
        };

        linha.insertCell(4).append(btn);
    });
};
let idParaExcluir = null;
//evento modal "sim"
document.getElementById('btnConfirmarExclusao').onclick = function() {
    if (idParaExcluir !== null) {
        bd.remover(idParaExcluir); 
        idParaExcluir = null; 
        $('#modalConfirmacao').modal('hide'); 
        window.location.reload(); 
    }
};

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    carregarListaDespesas(despesas, true);
}