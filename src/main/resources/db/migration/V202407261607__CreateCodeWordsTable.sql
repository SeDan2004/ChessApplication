create table code_words(
    id serial primary key,
    id_user int references users(id),
    code_word text
)