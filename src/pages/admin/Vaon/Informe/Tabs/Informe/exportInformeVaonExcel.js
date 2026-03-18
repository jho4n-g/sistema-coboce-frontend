import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const formatNumber = (value) => Number(value ?? 0);

export async function exportInformeVaonExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Informe VAON');

  worksheet.columns = [
    { header: 'DESCRIPCION', key: 'descripcion', width: 28 },
    { header: 'UNIDAD', key: 'unidad', width: 14 },
    { header: 'CANTIDAD', key: 'cantidad', width: 16 },
    { header: 'COSTO UNITARIO (BOB)', key: 'costoUnitario', width: 22 },
    { header: 'COSTO TOTAL (BOB)', key: 'costoTotal', width: 20 },
  ];
  worksheet.getColumn(4).numFmt = '0.0000';
  const totalUnitarioInsumos =
    formatNumber(data?.precioUnitario_transp) +
    formatNumber(data?.precioUnitario_caja) +
    formatNumber(data?.precionUnitario_energia) +
    formatNumber(data?.preconUnitario_gas) +
    formatNumber(data?.precioUnitario_agua);

  const totalCostoInsumos =
    formatNumber(data?.costoTotal_transp) +
    formatNumber(data?.costoTotal_agua) +
    formatNumber(data?.costoTotal_gas) +
    formatNumber(data?.costoTotal_energia) +
    formatNumber(data?.costoTotal_caja);

  worksheet.mergeCells('A1:E1');
  worksheet.getCell('A1').value = 'INFORME VAON';
  worksheet.getCell('A1').font = { bold: true, size: 16 };
  worksheet.getCell('A1').alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };

  worksheet.mergeCells('A2:B2');
  worksheet.getCell('A2').value = `Periodo: ${data?.periodo || ''}`;

  worksheet.mergeCells('C2:E2');
  worksheet.getCell('C2').value = `Formato: ${data?.formato || ''}`;

  const addSection = (title) => {
    const row = worksheet.addRow([title, '', '', '', '']);
    worksheet.mergeCells(`A${row.number}:E${row.number}`);
    row.font = { bold: true };
    row.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9EAF7' },
    };
    row.alignment = { horizontal: 'left', vertical: 'middle' };
  };

  const addDataRow = (
    descripcion,
    unidad,
    cantidad,
    costoUnitario,
    costoTotal,
  ) => {
    const row = worksheet.addRow([
      descripcion,
      unidad,
      formatNumber(cantidad),
      formatNumber(costoUnitario),
      formatNumber(costoTotal),
    ]);

    row.getCell(3).numFmt = '#,##0.00';
    row.getCell(4).numFmt = '#,##0.00';
    row.getCell(5).numFmt = '#,##0.00';

    return row;
  };

  addSection('1. MATERIA PRIMA');
  addDataRow(
    'ARCILLA',
    'kg',
    data?.cantidad_arcilla,
    data?.precionUnitario_arcilla,
    data?.costoTotal_arcilla,
  );
  addDataRow(
    'TOTAL MATERIA PRIMA',
    '',
    data?.cantidad_arcilla,
    data?.precionUnitario_arcilla,
    data?.costoTotal_arcilla,
  );

  addSection('2. INSUMOS');
  addDataRow(
    'Carton',
    'Pza',
    data?.cantidad_cajas,
    data?.precioUnitario_caja,
    data?.costoTotal_caja,
  );
  addDataRow(
    'Energia electrica',
    'KW',
    data?.cantidad_energia,
    data?.precionUnitario_energia,
    data?.costoTotal_energia,
  );
  addDataRow(
    'Gas natural',
    'Pcs',
    data?.cantidad_gas,
    data?.preconUnitario_gas,
    data?.costoTotal_gas,
  );
  addDataRow(
    'Agua',
    'LTS',
    data?.cantidad_agua,
    data?.precioUnitario_agua,
    data?.costoTotal_agua,
  );
  addDataRow(
    'Transp. Arcilla',
    'KG',
    data?.cantidad_transp,
    data?.precioUnitario_transp,
    data?.costoTotal_transp,
  );
  addDataRow('TOTAL INSUMO', '', '', totalUnitarioInsumos, totalCostoInsumos);

  addSection('PRODUCCION IMPORTADO');
  addDataRow(
    data?.nombres_insumo || 'Sin nombre',
    '',
    data?.cantidad_insumo,
    data?.precioUnitario_insumos,
    data?.costoTotal_insumo,
  );
  addDataRow(
    'TOTAL INSUMO',
    '',
    data?.cantidad_insumo,
    data?.precioUnitario_insumos,
    data?.costoTotal_insumo,
  );

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  });

  worksheet.getRow(4).font = { bold: true };
  worksheet.getRow(4).alignment = { horizontal: 'center' };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, `Informe_VAON_${data?.periodo || 'sin_periodo'}.xlsx`);
}
