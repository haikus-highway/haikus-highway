import React from 'react';

const TitleForm = (props) => {
  return (
    <form action="submit" onSubmit={props.saveHaiku} className="titleForm wrapper">
      <label htmlFor="titleInput" className="visuallyHidden">Title: </label>
      <input onChange={props.handleTitleInput} type="text" id="titleInput" name="titleInput" placeholder="Title" />
      <label htmlFor="authorInput" className="visuallyHidden">Author: </label>
      <input onChange={props.handleAuthorInput} type="text" id="authorInput" name="authorInput" placeholder="Author" />
      <button type="submit">Save to Journal</button>
    </form>
  )
}

export default TitleForm;