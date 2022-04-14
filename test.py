import requests
import json

#Sign up a user (unlock this test by turning locker to true)
locker=False
if (locker==True):
    user={
    'username': 'louaiZaiter',
    'email': 'zlouai@gmail.com',
    'password': '12AZqswx!!',
    }
    r=requests.post("http://localhost:3000/api/user/register", json=user)
    print(r.status_code)
    print(r.json())
    
print('----------------------------------------------------------------------------')

#Login a user and store the token and the user id
user={
    'email': 'zlouai@gmail.com',
    'password': '12AZqswx!!',
}
r=requests.post("http://localhost:3000/api/user/login", json=user)
token=r.json()['auth-token']
user_id= r.json()['user_id']

print('----------------------------------------------------------------------------')
#declare the authorization header for further tests
headers = {'auth-token': token}

#create an item
item = {
   'item':{ 'title': 'HAMHAM',
    'description': 'nothing',
    'expiration' :'2022-02-11T01:12:51.118+00:00',
    'owner': user_id, 
    'condtion': 'New'}}
r=requests.post("http://localhost:3000/api/auctions/items", headers = headers, json=item)
print(r.json())
item_id= r.json()['_id']

print('-----------------------------------------------------------------------------------')

#create an auction associated to the previous item
from datetime import datetime, timezone,timedelta
a_datetime = datetime.now(timezone.utc)
a_datetime= a_datetime+ timedelta(seconds=5)
formatted_datetime = a_datetime.isoformat()
auction={   
    'auction':{ 
    'price': 10,
    'status': True,
    'timer' :formatted_datetime,
    'user': user_id, 
    'item': item_id
    }}
r=requests.post("http://localhost:3000/api/auctions", headers = headers, json=auction)
print(r.json())
auction_id= r.json()['_id']

#get active auctions
r=requests.get("http://localhost:3000/api/auctions/active", headers = headers)
print(r.json())

print('-----------------------------------------------------------------------------------')

#bid for an active auction
bid_1={
    'bid':{
        'price': 10000,
        'user': '622dc8570e4910905d9455e3'
    }
}
bid_2={
    'bid':{
        'price': 7000,
        'user': '622dc8570e4910905d9455e3'
    }
}
r=requests.patch('http://localhost:3000/api/auctions/bid/'+auction_id, headers=headers, json=bid_1)
r=requests.patch('http://localhost:3000/api/auctions/bid/'+auction_id, headers=headers, json=bid_2)
print(r.json())

#Browse sold items
r=requests.get('http://localhost:3000/api/auctions/items/sold', headers=headers)
print(r.json())


print('-----------------------------------------------------------------------------------')

#Browse bidding history of a sold item
r=requests.get('http://localhost:3000/api/auctions/items/sold/'+item_id, headers=headers)
print(r.json())