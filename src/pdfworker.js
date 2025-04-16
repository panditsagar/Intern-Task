// pdfjs worker setups 
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?worker';

GlobalWorkerOptions.workerPort = new pdfWorker();
