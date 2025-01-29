document.addEventListener("DOMContentLoaded", function () {
    loadChecklist();
});

// Salvar checklist no LocalStorage
function saveChecklist() {
    const checkboxes = document.querySelectorAll(".checklist-item");
    const tecnico = document.getElementById("tecnico").value.trim();
    const data = document.getElementById("data").value.trim();

    let checklistState = [];
    let allChecked = true;

    checkboxes.forEach((checkbox) => {
        checklistState.push(checkbox.checked);
        if (!checkbox.checked) {
            allChecked = false; // Se algum checkbox não estiver marcado, muda para false
        }
    });

    // Validação: Todos os checkboxes devem estar marcados
    if (!allChecked) {
        alert("Por favor, marque todos os itens antes de salvar a checklist.");
        return;
    }

    // Validação: Técnico e Data precisam estar preenchidos
    if (!tecnico || !data) {
        alert("Por favor, preencha o nome do Técnico e a Data antes de salvar.");
        return;
    }

    const checklistData = {
        checklistState,
        tecnico,
        data,
    };

    // Salvar no LocalStorage
    localStorage.setItem("checklist", JSON.stringify(checklistData));
    alert("Checklist salva com sucesso!");
}

// Carregar checklist salva no LocalStorage
function loadChecklist() {
    const storedChecklist = JSON.parse(localStorage.getItem("checklist"));

    if (storedChecklist) {
        const checkboxes = document.querySelectorAll(".checklist-item");
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = storedChecklist.checklistState[index];
        });

        document.getElementById("tecnico").value = storedChecklist.tecnico || "";
        document.getElementById("data").value = storedChecklist.data || "";
    }
}

// Resetar a checklist e limpar o LocalStorage
function resetChecklist() {
    localStorage.removeItem("checklist"); // Apaga os dados salvos no LocalStorage

    const checkboxes = document.querySelectorAll(".checklist-item");
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false; // Desmarca todos os checkboxes
    });

    document.getElementById("tecnico").value = "";
    document.getElementById("data").value = "";
}

// Exportar checklist como TXT
function exportToTxt() {
    const tecnico = document.getElementById("tecnico").value.trim();
    const data = document.getElementById("data").value.trim();
    const checkboxes = document.querySelectorAll(".checklist-item");

    let checklistContent = `Checklist Recolhimento de Equipamento - TI\n\n`;
    checklistContent += `Técnico Responsável: ${tecnico}\n`;
    checklistContent += `Data: ${data}\n\n`;

    checkboxes.forEach((checkbox) => {
        checklistContent += `[${checkbox.checked ? "✔" : "✘"}] ${checkbox.parentElement.innerText}\n`;
    });

    const blob = new Blob([checklistContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "checklist.txt";
    link.click();
}

// Exportar checklist como PDF
function exportToPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tecnico = document.getElementById("tecnico").value.trim();
    const data = document.getElementById("data").value.trim();
    const checkboxes = document.querySelectorAll(".checklist-item");

    doc.setFont("helvetica", "bold");
    doc.text("Checklist Recolhimento de Equipamento - TI", 10, 10);
    doc.setFont("helvetica", "normal");
    doc.text(`Técnico Responsável: ${tecnico}`, 10, 20);
    doc.text(`Data: ${data}`, 10, 30);

    let y = 40;
    checkboxes.forEach((checkbox) => {
        doc.text(`[${checkbox.checked ? "✔" : "✘"}] ${checkbox.parentElement.innerText}`, 10, y);
        y += 10;
    });

    doc.save("checklist.pdf");
}
