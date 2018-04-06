window.onload = () => {
  const list = ['item1', ['item2', 'item3', 'item4'], 'item5', 'item6', ['item7', ['item8', 'item9']]];
  document.getElementById('list').appendChild(createList(list));
}

function createList(arr) {
  if (!Array.isArray(arr)) {
    return false;
  }
  let list = document.createElement('ul');
  arr.forEach((value, index) => {
    if (!Array.isArray(value)) {
      list.appendChild(setItem(value));
    }

    if (Array.isArray(value)) {
      list.appendChild(setList(value));
    }
  })

  return list;
}

/**
 * 设置item
 * 
 * @param {any} name
 * @returns
 */
function setItem(name) {
  const _item = document.createElement('li');
  const _span = document.createElement('span');
  _span.innerHTML = name;
  _item.appendChild(_span);

  _span.addEventListener('click', () => {
    selectItem(_item)
  });
  return _item;
}

/**
 * 设置folder
 * 
 * @param {any} list
 * @returns
 */
function setList(list) {
  const _folder = document.createElement('li');
  const _icon = document.createElement('i');
  _icon.innerHTML = '>';
  _folder.appendChild(_icon);

  const _span = document.createElement('span');
  _span.innerHTML = 'folder';
  _folder.appendChild(_span);

  _folder.classList.add('folder');
  _folder.appendChild(createList(list));

  _icon.addEventListener('click', (e) => {
    e.stopPropagation();
    _folder.classList.toggle('open');
  });

  _span.addEventListener('click', selectItem.bind(this, _folder));
  return _folder;
}


/**
 * 选择一个项目
 * 
 * @param {any} item
 */
function selectItem(item) {
  const _selected = document.getElementsByClassName('selected')[0];
  if (_selected) {
    _selected.classList.remove('selected');
  }
  item.classList.add('selected');
}

/**
 * 在folder中新建一个item
 * 
 * @param {any} name
 */
function addItem() {
  const _selected = document.getElementsByClassName('selected')[0];
  if (_selected && _selected.classList.contains('folder')) {
    let _item;
    const name = getInputName();
    if (name) {
      _item = setItem(name)
    }
    _selected.getElementsByTagName('ul')[0].appendChild(_item);
  } else {
    alert('请选择一个folder')
  }

}

/**
 * 删除一个item
 */
function deleteItem() {
  const _selected = document.getElementsByClassName('selected')[0];
  if (_selected && confirm('是否删除？')) {
    _selected.getElementsByTagName('span')[0].removeEventListener('click', selectItem.bind(this, _selected));
    _selected.parentNode.removeChild(_selected);
  }
}

/**
 * 获取input输入的值
 * 
 * @returns
 */
function getInputName() {
  const name = document.getElementById('input').value.trim();
  if (name) {
    return name;
  } else {
    alert('请输入内容');
  }
}

/**
 * 搜索
 */
function search() {
  searchName(document.getElementById('list'), getInputName());
}

function searchName(tree, name) {
  for (let i = 0; i < tree.children.length; i++) {
    const _child = tree.children[i];
    if (_child.tagName === 'SPAN' && _child.innerHTML.indexOf(name) > -1) {
      _child.parentNode.classList.add('searched');
      checkOpen(_child);
    } else {
      _child.parentNode.classList.remove('searched');
    }

    if (_child.children.length > 0) {
      searchName(_child, name);
    }
  }
}

/**
 * 检查父元素是否展开
 * 
 * @param {any} child
 */
function checkOpen(child) {
  if (child.parentNode && child.parentNode.classList) {
    if (child.parentNode.classList.contains('folder')) {
      child.parentNode.classList.add('open')
    }
    checkOpen(child.parentNode)
  }
}