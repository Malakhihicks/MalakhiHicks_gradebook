window.onload = async function () {
  try {
    const response = await fetch('/api/grades');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const grades = await response.json();

    const table = document.getElementById('gradebookTable');

    // Clear any existing rows except the header
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }

    grades.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.first_name} ${student.last_name}</td>
        <td>${parseFloat(student.total_grade).toFixed(2)}</td>
        <td>-</td>
        <td>-</td>
      `;
      table.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading grades:', err);
  }
};
