echo "TEST MAIL" | mail \
  -r sender@domain.tld \
  -s "Test Subject" \
  -S mta=smtp://localhost:25 \
  -S smtp-auth=none \
  -S v15-compat=yes \
  user@domain.tld

echo "TEST MAIL" | swaks \
  --server localhost \
  --port 25 \
  --to user@domain.tld \
  --from sender@domain.tld \
  --header "Subject: Test Subject" \
  --body "TEST MAIL"
