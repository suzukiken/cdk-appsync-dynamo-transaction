import urllib.request
import json
import os
from string import Template
from pprint import pprint
from random import randint

headers = {
  'x-api-key': os.environ['API_KEY'],
  'Content-Type': 'application/graphql'
}

def requ(data):
  req = urllib.request.Request(url=os.environ['GRAPHQL_ENDPOINT'], data=data, headers=headers, method='POST')
  f = urllib.request.urlopen(req)
  return json.loads(f.read().decode('utf-8'))

schema = '''
  query { 
    listStocks { 
      id
      pcs
      sku
    }
  }
'''
data = json.dumps({ 'query': schema }).encode('utf-8')
res = requ(data)

stock_ids = []
for stock in res['data']['listStocks'][:2]:
  stock_ids.append(stock['id'])

schema = '''
  mutation {
    adjustPcsTransaction(input: [
      {
          delta: 10, 
          increment: true, 
          id: "$stock_id_1"
      }, {
          delta: 10, 
          increment: true, 
          id: "$stock_id_2"
      }]){
      keys {
        id
      }
      cancellationReasons {
        message
        type
      }
    }
  }
'''

query = Template(schema).substitute(stock_id_1=stock_ids[0], stock_id_2=stock_ids[1])
data = json.dumps({ 'query': query }).encode('utf-8')
pprint(requ(data))

schema = '''
  mutation {
    adjustPcsTransaction(input: [
      {
          delta: 5, 
          increment: false, 
          id: "$stock_id_1"
      }, {
          delta: 20, 
          increment: false, 
          id: "$stock_id_2"
      }]){
      keys {
        id
      }
      cancellationReasons {
        message
        type
      }
    }
  }
'''

query = Template(schema).substitute(stock_id_1=stock_ids[0], stock_id_2=stock_ids[1])
data = json.dumps({ 'query': query }).encode('utf-8')
pprint(requ(data))