export class Todo {
  //+ для зберігання данних
  static #NAME = "todo";

  static #saveData = () => {
    localStorage.setItem(
      this.#NAME,
      JSON.stringify({
        list: this.#list,
        count: this.#count,
      })
    );
  };

  static #loadData = () => {
    const data = localStorage.getItem(this.#NAME);

    if (data) {
      const { list, count } = JSON.parse(data);
      this.#list = list;
      this.#count = count;
    }
  };
  //++ для зберігання данних

  static #list = [];
  static #count = 0;

  static #createTaskData = (text) => {
    this.#list.push({
      id: ++this.#count,
      text,
      done: false,
    });
  };

  static #block = null;
  static #template = null;
  static #input = null;
  static #button = null;

  static init = () => {
    this.#template = document.getElementById("task").content.firstElementChild;

    this.#block = document.querySelector(".task__list");

    this.#input = document.querySelector(".form__input");

    this.#button = document.querySelector(".form__button");

    this.#button.onclick = this.#handleAdd;

    this.#loadData();

    this.#render();

    // console.log(this.#block, this.#button, this.#input, this.#template);
  };

  static #handleAdd = () => {
    this.#createTaskData(this.#input.value);
    this.#input.value = "";
    this.#render();
    this.#saveData();

    // console.log(this.#list);
  };

  static #render = () => {
    this.#block.innerHTML = "";

    if (this.#list.length === 0) {
      this.#block.innerHTML = `Список задач порожній`;
    } else {
      this.#list.forEach((taskData) => {
        const el = this.#createTaskElem(taskData);
        this.#block.append(el);
      });
    }
  };

  static #createTaskElem = (data) => {
    const el = this.#template.cloneNode(true);

    const [id, text, btnDo, btnCancel] = el.children;

    id.innerText = `${data.id}.`;

    text.innerText = data.text;

    btnCancel.onclick = this.#handleCancel(data);

    btnDo.onclick = this.#handleDo(data, btnDo, el);

    if (data.done) {
      el.classList.add("task--done");
      btn.classList.remove("task__button--do");
      btn.classList.add("task__button--done");
    }

    return el;
  };

  static #handleDo = (data, btn, el) => () => {
    const result = this.#toggleDone(data.id);

    if (result === true || result === false) {
      el.classList.toggle("task--done");
      btn.classList.toggle("task__button--do");
      btn.classList.toggle("task__button--done");

      this.#saveData();
    }
  };

  static #toggleDone = (id) => {
    const task = this.#list.find((item) => item.id === id);

    if (task) {
      task.done = !task.done;
      return task.done;
    } else {
      return null;
    }
  };

  static #handleCancel = (data) => () => {
    if (confirm("Видалити задачу?")) {
      const result = this.#deleleById(data.id); //t
      if (result) {
        this.#render(); //t
        this.#saveData();
      }

      // this.#deleleById(data.id); //f
      // this.#render(); //f
    }
  };

  static #deleleById = (id) => {
    this.#list = this.#list.filter((item) => item.id !== id);
    return true; //t
  };
}

Todo.init();

window.tudo = Todo;
