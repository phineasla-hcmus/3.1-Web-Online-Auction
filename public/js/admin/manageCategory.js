function actionAddRoot() {
  const buttonAddRoot = document.getElementById('addRootButton');
  const actionAddRoot = document.getElementById('addRootAction');

  buttonAddRoot.setAttribute('hidden', 'hidden');
  actionAddRoot.removeAttribute('hidden');
  console.log(buttonAddRoot);
  console.log(actionAddRoot);
}
function onClick(id) {
  if (
    document.getElementById(`parentCat${id}`).style.background === '#292560'
  ) {
    document.getElementById(`parentCat${id}`).style.background = '#fff';
  } else {
    document.getElementById(`parentCat${id}`).style.background = '#292560';
  }
  if (document.getElementById(`child${id}`).style.display === 'contents') {
    document.getElementById(`parentCat${id}`).style.background = '#fff';
    document.getElementById(`child${id}`).style.display = 'none';
  } else {
    document.getElementById(`child${id}`).style.display = 'contents';
  }
}
