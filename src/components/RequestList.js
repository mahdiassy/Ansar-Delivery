<div className="input-with-icon mb-4">
  <FaSearch className="icon" />
  <input
    type="text"
    placeholder="Search requests..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="form-input"
  />
</div> 