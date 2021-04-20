import urllib.request
import json
import os
from string import Template
from pprint import pprint

skus = ('X10', 'X20')

schema = '''
  mutation { 
    addStock(sku: "$sku") { 
      id
      pcs
      sku
    }
  }
'''

headers = {
  'x-api-key': os.environ['API_KEY'],
  'Content-Type': 'application/graphql'
}

for sku in skus:
  query = Template(schema).substitute(sku=sku)
  data = json.dumps({ 'query': query }).encode('utf-8')
  req = urllib.request.Request(url=os.environ['GRAPHQL_ENDPOINT'], data=data, headers=headers, method='POST')
  f = urllib.request.urlopen(req)
  pprint(f.read().decode('utf-8'))

