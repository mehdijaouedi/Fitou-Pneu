import { defineType, defineArrayMember } from 'sanity';

// import utilisateur from './utilisateur';
import jente from './jentes';
import pneu from './pneus';
import mixt from './mixtes';
import clients from './clients';
import fournisseur from './fournisseur';
import media from './media';
import sale from './sales';

export const schemaTypes = [ jente, pneu, mixt, clients, fournisseur, media, sale ];
