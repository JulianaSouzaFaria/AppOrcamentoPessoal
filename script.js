
class Despesa{ //classe recuperando dados cadastrados no html
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados(){  //essa funcao obriga usuario a preencher os campos
		for(let i in this){
			if (this[i] == undefined || this[i] == "" || this[i] == null) { 
				return false
			}
		}
		return true
	}
	}

class Bd{ //criando indice dinamico, para criar varios itens e nao sobrepor
	constructor(){
		let id = localStorage.getItem("id")

		if (id === null) {
			localStorage.setItem("id", 0)
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem("id")
		return parseInt(proximoId) + 1
	}

	gravar(d) {

		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem("id", id)
}

	recuperarTodosRegistros(){

		//array de despesas
		let despesas = Array()
		let id = localStorage.getItem("id")

		//recuperar todas as despesas cadastradas em localStorage

		for(let i = 1; i <= id; i++){
			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver indices que foram pulados/removidos
			// nestes casos nós vamos pular esses índices 
			if (despesa === null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)

		}	
		return despesas}

		pesquisar(despesa){ //aplicando filtro no array

			let despesasFiltradas = Array()

			despesasFiltradas = this.recuperarTodosRegistros()
			console.log(despesasFiltradas)
			console.log(despesa)
			//ano

			if(despesa.ano != "") {
				despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
			}

			//mes

			if(despesa.mes != "") {
				despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
			}

			//dia

			if(despesa.dia != "") {
				despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
			}

			//tipo

			if(despesa.tipo != "") {
				despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
			}

			//descricao

			if(despesa.descricao != "") {
				despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
			}

			//valor

			if(despesa.valor != "") {
				despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
			}
			return despesasFiltradas
		}

		remover(id){
			localStorage.removeItem(id)
		}
}

let bd = new Bd()

function cadastrarDespesa() {  //funcao associada ao botao no html
let ano = document.getElementById('ano')
let mes = document.getElementById('mes')
let dia = document.getElementById('dia')
let tipo = document.getElementById('tipo')
let descricao = document.getElementById('descricao')
let valor = document.getElementById('valor')


let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value) // recupera todos os valores

//esse if e else serao responsaveis pelo aviso ao usuario de campos preenchidos ou nao. (vinculado ao Modal)
if(despesa.validarDados()){
	bd.gravar(despesa)

document.getElementById("tituloDiv").className = "modal-header text-success"
document.getElementById("titulo").innerHTML = "Registro inserido com sucesso"
document.getElementById("mensagem").innerHTML = "Despesa cadastrada com sucesso"
document.getElementById("botao").className = "btn btn-success"
document.getElementById("botao").innerHTML = "Voltar"


$('#registraDespesa').modal('show') 

//para limpar formulario após preencher.
ano.value = ""
mes.value = ""
dia.value = ""
tipo.value = ""
descricao.value = ""
valor.value = ""
 
}

else{ 
	document.getElementById("tituloDiv").className = "modal-header text-danger"
	document.getElementById("titulo").innerHTML = "Erro na gravação"
	document.getElementById("mensagem").innerHTML = "Existem campos obrigatórios que não foram preenchidos"
	document.getElementById("botao").className = "btn btn-danger"
	document.getElementById("botao").innerHTML = "Voltar e corrigir"

$('#registraDespesa').modal('show')
}

}

//funçao para onload na pagina consulta.html
function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros() 
	}   //cria metodo no bd

	//selecionando elemento tbody da tabela
	let listaDespesas = document.getElementById("listaDespesas")
	listaDespesas.innerHTML = ""
	//percorrer o array despesas, listando cada despesa
	despesas.forEach(function (d) {
		
	// criando a linha (tr)
	let linha = listaDespesas.insertRow();

	// criando as colunas (td)
	linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
	linha.insertCell(1).innerHTML = d.tipo
	linha.insertCell(2).innerHTML = d.descricao
	linha.insertCell(3).innerHTML = d.valor

	//criar botao de exclusao
	let btn = document.createElement("button")
	btn.className = "btn btn-danger"
	btn.innerHTML = `<i class="fas fa-times"></i>`
	btn.id = `id_despesa_${d.id}`
	btn.onclick = function () {
		//remover a despesa
		let id = this.id.replace('id_despesa_', '')

		bd.remover(id)

		//recarregar html com lista atualizada
		window.location.reload()
	}
	linha.insertCell(4).append(btn)
	console.log(d)
	})
}

function pesquisarDespesa() {  //essa funcao é disparada quando clica no botao pesqusiar na pagina consulta
	let ano = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)  //linkar com o bd

	this.carregaListaDespesas(despesas, true)
}



