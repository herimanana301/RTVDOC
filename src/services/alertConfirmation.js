import Swal from 'sweetalert2';
/********************** Delete confirmation **********************/

const inputConfirmation = (execution)=>{
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir créer le bon de commande ?',
    text: "Cette action est irréversible!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, créer!',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
        execution();
    }
  });
}


/********************** Delete confirmation **********************/

const confirmationPutModal = (id,action) => {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: "Cette action est irréversible!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, génerer la facture',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
        action(id);
    }
  });
};


const confirmationModal = (id,deletedUser) => {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: "Cette action est irréversible!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
        deletedUser(id);
    }
  });
};

const FactureconfirmationModal = (setStatus) => {
  Swal.fire({
    title: 'Etes vous sure?',
    text: "Confirmer le payement?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, confirmer!',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
        console.log('ok')
    }
    else{
      setStatus(false);
    }
  });
};

const ArchiverCommandeConfirm = (id,ArchiverCommande) => {
  Swal.fire({
    title: 'Archiver la commande?',
    text: "Vous etes sûr?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, archiver!',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      ArchiverCommande(id);
    }
  });
};


/******************************* *******************************/

export {inputConfirmation,confirmationModal,FactureconfirmationModal,ArchiverCommandeConfirm, confirmationPutModal};
