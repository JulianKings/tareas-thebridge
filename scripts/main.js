import { printBasicLayout, appendContent } from './layoutManager.js'
import { populateData } from './data/dataManager.js';
import './dateHelper.js';

// Load data
populateData();

// Load basic layout
printBasicLayout();
appendContent("linkHome");
