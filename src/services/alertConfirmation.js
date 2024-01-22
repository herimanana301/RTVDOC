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


/******************************* *******************************/

export {inputConfirmation,confirmationModal};
