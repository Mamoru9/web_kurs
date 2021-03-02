package storage

import (
	"Kursovaya/model"
	"context"
)

func (p *Provider) AddTranslationDB(translation model.Translation) error {
	ctx, cancel := context.WithTimeout(context.Background(), defaultCtxTimeout)
	defer cancel()

	tx, err := p.conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	var q string

	q = `INSERT INTO kursovaya.translations (translator_id, book_id)
			VALUES ($1, $2)`

	_, err = tx.Exec(q, translation.TranslatorID, translation.BookID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (p *Provider) GetTranslationsDB() ([]model.Translation, error) {
	var (
		q string
		err error
		translations = make([]model.Translation, 0)
	)

	q = `SELECT book_id,translator_id FROM kursovaya.translations`

	rows, err := p.conn.Query(q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var translation model.Translation

		if err := rows.Scan(
			&translation.BookID,
			&translation.TranslatorID,
			); err != nil {
			return nil, err
		}

		translations = append(translations, translation)
	}

	return translations, rows.Err()
}
