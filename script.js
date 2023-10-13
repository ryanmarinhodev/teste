let currentPageUrl = 'https://swapi.dev/api/people/'; // A URL base para carregar informações dos personagens

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl); // Carrega os personagens quando a página é carregada
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button'); // Obtém o botão "Próximo"
    const backButton = document.getElementById('back-button'); // Obtém o botão "Anterior"

    nextButton.addEventListener('click', loadNextPage); // Adiciona um ouvinte de evento para o botão "Próximo"
    backButton.addEventListener('click', loadPreviousPage); // Adiciona um ouvinte de evento para o botão "Anterior"
}

async function loadCharacters(url) { // Função para carregar informações dos personagens a partir da URL fornecida
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Limpa resultados anteriores

    try {
        const response = await fetch(url); // Faz uma solicitação HTTP para a URL
        const responseJson = await response.json(); // Converte a resposta em JSON

        responseJson.results.forEach((character) => { // Itera sobre os resultados e cria cartões para cada personagem
            const card = document.createElement("div");
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
            card.className = "cards";

            const characterNameBg = document.createElement("div");
            characterNameBg.className = "character-name-bg";

            const characterName = document.createElement("span");
            characterName.className = "character-name";
            characterName.innerText = `${character.name}`;

            characterNameBg.appendChild(characterName);
            card.appendChild(characterNameBg);

            // Configura um evento de clique para exibir informações detalhadas quando o cartão é clicado
            card.onclick = () => {
                const modal = document.getElementById("modal");
                modal.style.visibility = "visible";

                const modalContent = document.getElementById("modal-content");
                modalContent.innerHTML = '';

                const characterImage = document.createElement("div");
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
                characterImage.className = "character-image";

                const name = document.createElement("span");
                name.className = "character-details";
                name.innerText = `Nome: ${character.name}`;

                const characterHeight = document.createElement("span");
                characterHeight.className = "character-details";
                characterHeight.innerText = `Altura: ${convertHeigth(character.height)}`;

                const mass = document.createElement("span");
                mass.className = "character-details";
                mass.innerText = `Peso: ${convertMass(character.mass)}`;

                const eyeColor = document.createElement("span");
                eyeColor.className = "character-details";
                eyeColor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}`;

                const birthYear = document.createElement("span");
                birthYear.className = "character-details";
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`;

                modalContent.appendChild(characterImage);
                modalContent.appendChild(name);
                modalContent.appendChild(characterHeight);
                modalContent.appendChild(mass);
                modalContent.appendChild(eyeColor);
                modalContent.appendChild(birthYear);
            }

            mainContent.appendChild(card);
        });

        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');

        nextButton.disable = !responseJson.next; // Desabilita o botão "Próximo" se não houver próxima página
        backButton.disable = !responseJson.previous; // Desabilita o botão "Anterior" se não houver página anterior

        backButton.style.visibility = responseJson.previous ? "visible" : "hidden"; // Torna o botão "Anterior" visível ou oculto com base na presença de uma página anterior

        currentPageUrl = url; // Atualiza a URL da página atual
    } catch {
        alert('Erro ao carregar personagens');
        console.log(error);
    }
}

// Função para carregar a próxima página
async function loadNextPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.next); // Carrega os personagens da próxima página
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a próxima página');
    }
}

// Função para carregar a página anterior
async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.previous); // Carrega os personagens da página anterior
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página anterior');
    }
}

// Função para ocultar o modal
function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
}

function convertEyeColor(eyeColor) {
    const cores = {
        blue: "azul",
        bronw: "castanho",
        green: "verde",
        yellow: "amarelo",
        black: "preto",
        pink: "rosa",
        red: "vermelho",
        orange: "laranja",
        hazel: "avela",
        unknow: "desconhecida"
    };

    return cores[eyeColor.toLowerCase()] || eyeColor;
}

function convertHeigth(height) {
    if (height === "unknow") {
        return "desconhecida";
    }

    return (height / 100).toFixed(2);
}

function convertMass(mass) {
    if (mass === "unknow") {
        return "desconhecido";
    }

    return `${mass} kg`;
}

function convertBirthYear(birthYear) {
    if (birthYear === "unknow") {
        return "desconhecido";
    }

    return birthYear;
}