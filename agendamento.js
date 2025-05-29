document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('agendamentoForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    //  Validar ou processar o formulário antes
    alert('Agendamento confirmado! Obrigado.');

    // Para limpar o formulário depois
    form.reset();
  });
});
