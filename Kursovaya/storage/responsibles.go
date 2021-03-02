package storage

import (
	"Kursovaya/model"
	"context"
)

func (p *Provider) AddResponsibleDB(responsible model.Responsible) error {
	ctx, cancel := context.WithTimeout(context.Background(), defaultCtxTimeout)
	defer cancel()

	tx, err := p.conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	var q string

	q = `INSERT INTO kursovaya.responsibles (editor_id, book_id)
			VALUES($1, $2)`

	_, err = tx.Exec(q, responsible.EditorID, responsible.BookID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (p *Provider) GetResponsibleDB() ([]model.Responsible, error) {
	var (
		q string
		err error
		responsible = make([]model.Responsible, 0)
	)

	q = `SELECT editor_id, book_id FROM kursovaya.responsibles`

	rows, err := p.conn.Query(q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var responsle model.Responsible

		if err := rows.Scan(
			&responsle.EditorID,
			&responsle.BookID,
			); err != nil {
			return nil, err
		}

		responsible = append(responsible, responsle)
	}

	return responsible, rows.Err()
}
