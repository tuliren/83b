import { PDFDocument } from 'pdf-lib';
import { FormDataMap } from '../params/common';

export async function loadPdfTemplate(): Promise<Uint8Array> {
  const response = await fetch('/forms/f15620.pdf');
  const pdfBytes = await response.arrayBuffer();
  return new Uint8Array(pdfBytes);
}

export async function fillPdfForm(formData: FormDataMap): Promise<Uint8Array> {
  const pdfBytes = await loadPdfTemplate();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  const form = pdfDoc.getForm();
  
  if (formData['person-name']) {
    const taxpayerNameField = form.getTextField('Taxpayer\'s name');
    taxpayerNameField?.setText(formData['person-name'] as string);
  }
  
  if (formData['person-ssn']) {
    const taxpayerTinField = form.getTextField('Taxpayer\'s TIN');
    taxpayerTinField?.setText(formData['person-ssn'] as string);
  }
  
  if (formData['person-address']) {
    const addressLines = (formData['person-address'] as string).split(',');
    const addressField = form.getTextField('Address (number and street)');
    addressField?.setText(addressLines[0]?.trim() || '');
    
    if (addressLines.length > 1) {
      const cityStateZip = addressLines.slice(1).join(',').trim().split(' ');
      const city = cityStateZip.slice(0, -2).join(' ');
      const state = cityStateZip[cityStateZip.length - 2];
      const zip = cityStateZip[cityStateZip.length - 1];
      
      const cityField = form.getTextField('City');
      cityField?.setText(city);
      
      const stateField = form.getTextField('State or province');
      stateField?.setText(state);
      
      const zipField = form.getTextField('ZIP or postal code');
      zipField?.setText(zip);
    }
  }
  
  if (formData['company-name'] && formData['share-number']) {
    const propertyField = form.getTextField('2. The property which is the subject of this election is (describe property and quantity below)');
    propertyField?.setText(`${formData['share-number']} shares of ${formData['company-name']}`);
  }
  
  if (formData['transfer-date']) {
    const transferDateField = form.getTextField('3. The date the property was transferred');
    transferDateField?.setText(formData['transfer-date'] as string);
  }
  
  if (formData['tax-year']) {
    const taxYearField = form.getTextField('4. Taxable year for which the election is being made (taxable year that includes the date the property was transferred as reported in Box 3)');
    taxYearField?.setText(formData['tax-year'] as string);
  }
  
  const restrictionsField = form.getTextField('5. The property is subject to the following restrictions (describe applicable restrictions below)');
  restrictionsField?.setText('The shares are subject to repurchase by the Company or its assignee upon the occurrence of certain events. This repurchase right lapses based upon the continued performance of services by the taxpayer over time.');
  
  if (formData['fmv-per-share-price'] && formData['share-number']) {
    const valuePerItemField = form.getTextField('a. Value per item');
    valuePerItemField?.setText(`$${Number(formData['fmv-per-share-price']).toFixed(2)}`);
    
    const quantityField = form.getTextField('b. Quantity');
    quantityField?.setText(formData['share-number'] as string);
    
    const totalValueField = form.getTextField('6. The total fair market value of the property at the time of transfer is');
    totalValueField?.setText(`$${Number(formData['fmv-total-share-price']).toFixed(2)}`);
  }
  
  if (formData['paid-per-share-price'] && formData['share-number']) {
    const paidPerItemField = form.getTextField('a. Price paid per item');
    paidPerItemField?.setText(`$${Number(formData['paid-per-share-price']).toFixed(2)}`);
    
    const paidQuantityField = form.getTextField('b. Quantity_2');
    paidQuantityField?.setText(formData['share-number'] as string);
    
    const totalPaidField = form.getTextField('7. For the property transferred, the taxpayer paid a total of');
    totalPaidField?.setText(`$${Number(formData['paid-total-share-price']).toFixed(2)}`);
  }
  
  form.flatten();
  
  return await pdfDoc.save();
}
