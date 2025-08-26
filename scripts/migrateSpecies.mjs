// scripts/migrateSpecies.mjs

import admin from 'firebase-admin';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURACIÓN ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
const CSV_FILE_PATH = path.join(__dirname, '..', 'species-data.csv');
const COLLECTION_NAME = 'species';
// --------------------

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const speciesCollection = db.collection(COLLECTION_NAME);

console.log('Iniciando migración de especies desde el archivo CSV...');

const promises = []; // Array para guardar todas las promesas de escritura

fs.createReadStream(CSV_FILE_PATH)
  .pipe(csv())
  .on('data', (row) => {
    try {
      if (!row.especie_Id) {
        console.warn(`- Fila omitida por no tener ID: ${row.name || 'Sin Nombre'}`);
        return;
      }
      
      const category = parseInt(row.especie_Id) <= 6 ? 'DE_LEY' : 'GENERAL';
      const speciesData = {
        name: row.name,
        category: category,
        rules: [
          { points: parseInt(row.points1) || 0, size: parseInt(row.size1) || 0, isMandatory: row.isMandatory1 === 'TRUE' },
          { points: parseInt(row.points2) || 0, size: parseInt(row.size2) || 0, isMandatory: row.isMandatory2 === 'TRUE' },
          { points: parseInt(row.points3) || 0, size: parseInt(row.size3) || 0, isMandatory: row.isMandatory3 === 'TRUE' },
        ]
      };

      // En lugar de esperar aquí, añadimos la promesa al array
      const promise = speciesCollection.doc(row.especie_Id).set(speciesData);
      promises.push(promise);
      
      console.log(`- Programando escritura para Especie ID ${row.especie_Id} ("${speciesData.name}")`);

    } catch (error) {
      console.error(`Error procesando la fila con ID ${row.especie_Id}:`, error);
    }
  })
  .on('end', async () => {
    try {
      // Esperamos a que TODAS las promesas en el array se completen
      await Promise.all(promises);
      console.log(`--- Migración completada. Se procesaron ${promises.length} especies. ---`);
    } catch (error) {
      console.error("Error durante la escritura masiva a Firestore:", error);
    }
  });