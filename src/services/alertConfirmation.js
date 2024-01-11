import Swal from 'sweetalert2';



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
  }).then((result) => {
    if (result.isConfirmed) {
        deletedUser(id);
    }
  });
};


/******************************* *******************************/

export default confirmationModal;
