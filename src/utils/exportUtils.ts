export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert array of objects to CSV string
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header] === null || row[header] === undefined ? '' : row[header];
        // Handle strings that might contain commas
        if (typeof cell === 'string') {
          cell = `"${cell.replace(/"/g, '""')}"`;
        } else if (typeof cell === 'object') {
          cell = `"${JSON.stringify(cell).replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
};

export const exportToJSON = (data: any[], filename: string) => {
  if (!data || !data.length) return;
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
};

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  
  // Create object URL
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  
  // Append to html link element page
  document.body.appendChild(link);
  
  // Start download
  link.click();
  
  // Clean up and remove the link
  link.parentNode?.removeChild(link);
  URL.revokeObjectURL(url);
};
